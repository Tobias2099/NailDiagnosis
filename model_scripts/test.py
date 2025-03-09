import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

dataset_path = "../dataset/Dataset"

model = models.efficientnet_v2_s(weights=None)  # Don't need pretrained weights here
num_classes = len(datasets.ImageFolder(dataset_path + "/train").classes)
model.classifier = nn.Sequential(
    nn.Linear(model.classifier[1].in_features, 512),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(512, num_classes)
)

# Load the trained weights
model.load_state_dict(torch.load("efficientnet_nail_diagnosis.pth", map_location=device))
model = model.to(device)
model.eval()

# Data transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load test dataset
test_data = datasets.ImageFolder(root=dataset_path + "/test", transform=transform)
test_data.classes = sorted(test_data.classes, key=str.lower)
print("Test Data Clases: ", test_data.classes)
test_loader = DataLoader(test_data, batch_size=32, shuffle=False)

# Evaluate the model
correct, total = 0, 0
with torch.no_grad():
    for images, labels in test_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = 100 * correct / total
print(f"Test Accuracy: {accuracy:.2f}% ✅")