import torch
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import datasets, transforms
import matplotlib.pyplot as plt
import torchvision.models as models
import torch.nn as nn
import torch.optim as optim

# Check if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

dataset_path = "./dataset/Dataset"

# Using pretrained model, EfficientNetV2
model = models.efficientnet_v2_s(pretrained=True) 

# Freeze all layers except the classifier to save computational power
for param in model.features.parameters():
    param.requires_grad = False  # Freeze feature extraction layers

# Replace classifier with a new fully connected layer for your dataset
num_classes = len(datasets.ImageFolder(dataset_path + "/train").classes)
model.classifier = nn.Sequential(
    nn.Linear(model.classifier[1].in_features, 512),  # Reduce to 512 neurons
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(512, num_classes)  # Final output layer
)

# Move model to GPU if available
model = model.to(device)

# Define transformations for images (resize, convert to tensor, normalize)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize to 224x224
    transforms.ToTensor(),          # Convert to PyTorch tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize using mean and std from ImageNet
])

# Load the training dataset
training_data = datasets.ImageFolder(
    root=dataset_path + "/train",
    transform=transform
)

# Load the test dataset
test_data = datasets.ImageFolder(
    root=dataset_path + "/test",
    transform=transform
)

# labelList = training_data.classes
# print(labelList)

# Create DataLoaders
train_loader = DataLoader(training_data, batch_size=32, shuffle=True)
test_loader = DataLoader(test_data, batch_size=32, shuffle=False)

criterion = nn.CrossEntropyLoss() #loss function specialized in classification
optimizer = optim.Adam(model.classifier.parameters(), lr=0.001) #Adam optimizer, good for classification


#-------------TRAINING------------------
num_epochs = 10  # You can change this

for epoch in range(num_epochs):
    model.train()  # Set model to training mode
    running_loss = 0.0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)  # Move to GPU if available

        optimizer.zero_grad()  # Reset gradients
        outputs = model(images)  # Forward pass
        loss = criterion(outputs, labels)  # Compute loss
        loss.backward()  # Backpropagation
        optimizer.step()  # Update weights

        running_loss += loss.item()

    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss/len(train_loader):.4f}")

print("Training Complete ✅")
#-----------------------------------------

# Save the trained model
torch.save(model.state_dict(), "efficientnet_nail_diagnosis.pth")
print("Model saved as efficientnet_nail_diagnosis.pth")