import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

import mysql.connector
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

#Database Information
db_config = {
   "host": os.getenv('MYSQL_HOST'),
   "user": os.getenv('MYSQL_USER'),
   "password": os.getenv('MYSQL_PASSWORD'),
   "database": os.getenv('MYSQL_DATABASE')
}

def get_db_connection():
   return mysql.connector.connect(**db_config)

app = Flask(__name__)
CORS(app)  # Enable CORS

#Home path
@app.route('/')
def home():
   return "Flask MySQL Integration with .env Successful!"


# ✅ Fix MODEL_PATH to match the correct model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../model_scripts/efficientnet_nail_diagnosis.pth"))
# print("MODEL PATH: " + MODEL_PATH)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "../uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ Load EfficientNetV2-S instead of EfficientNet-B0
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.efficientnet_v2_s(weights=None)  # ✅ Load the same architecture used during training

# ✅ Match classifier structure to training script
num_classes = 17  # Adjust this if your dataset has a different number of classes
model.classifier = torch.nn.Sequential(
    torch.nn.Linear(model.classifier[1].in_features, 512),
    torch.nn.ReLU(),
    torch.nn.Dropout(0.3),
    torch.nn.Linear(512, num_classes)
)

# ✅ Load trained weights
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))  # Load model weights
model.to(device)
model.eval()  # Set model to evaluation mode

# ✅ Define preprocessing transformations (Must match training pipeline)
transform = transforms.Compose([
    transforms.Resize((224, 224)), 
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ✅ Define class names based on dataset structure
CLASS_NAMES = [
    "Alopecia Areata",
    "Beau's Lines",
    "Bluish Nail",
    "Clubbing",
    "Darier's Disease",
    "Eczema",
    "Half and Half Nails (Lindsay's Nails)",
    "Koilonychia",
    "Leukonychia",
    "Muehrcke's Lines",
    "Onycholysis",
    "Pale Nail",
    "Red Lunula",
    "Splinter Hemorrhage",
    "Terry's Nail",
    "White Nail",
    "Yellow Nails"
]

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    confidence_threshold = 60
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    # ✅ Get uploaded image
    image = request.files["image"]
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
    image.save(image_path)

    # ✅ Load and preprocess image
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)

    # ✅ Make a prediction
    with torch.no_grad():
        output = model(img)
        predicted_class = torch.argmax(output, dim=1).item()
        probabilities = torch.nn.functional.softmax(output, dim=1)  # Convert logits to probabilities
        confidence = probabilities[0, predicted_class].item() * 100  # Convert to percentage

    if confidence > confidence_threshold:
      diagnosis = CLASS_NAMES[predicted_class]  # Get diagnosis label
    else:
      diagnosis = "no illness detected"

    return jsonify({"diagnosis": diagnosis, 
                    "filename": image.filename,
                    "confidence": confidence
                  })

@app.route('/api/register', methods=['POST'])
def register_user():
   try:
      data = request.json
      username = data.get('username')
      email = data.get('email')
      password = data.get('password')

      #Validate the input
      if not (username and email and password):
         return jsonify({'error': 'Missing required fields'}), 400
      
      #Hash the password
      hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

      #Insert user into database
      db = get_db_connection()
      cursor = db.cursor()

      #Check if email already exists
      cursor.execute('SELECT id FROM users WHERE email = %s', (email,))
      existing_user = cursor.fetchone()

      if existing_user:
         cursor.close()
         db.close()
         return jsonify({'error': 'Email already registered'}), 409
      
      #Insert new user
      cursor.execute('INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)', (username, email, hashed_password))

      db.commit()
      cursor.close()
      db.close()
      return jsonify({'message': 'User registered successfully'}), 201
   except Exception as e:
      return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)