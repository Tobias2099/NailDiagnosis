import torch
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import datasets, transforms
import matplotlib.pyplot as plt

dataset_path = "./dataset/Dataset"

# Define transformations (resize, convert to tensor, normalize)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize to 224x224
    transforms.ToTensor(),          # Convert to PyTorch tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize
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

labelList = training_data.classes
print(labelList)

# Create DataLoaders
train_loader = DataLoader(training_data, batch_size=32, shuffle=True)
test_loader = DataLoader(test_data, batch_size=32, shuffle=False)

# Visualize a few training images (optional)
data_iter = iter(train_loader)
images, labels = next(data_iter)

# Set the number of images to display
num_images = 6
fig, axes = plt.subplots(2, 3, figsize=(8, 6))  # Create a 2x3 grid for 6 images

for i in range(num_images):
    ax = axes[i // 3, i % 3]  # Determine subplot position
    ax.imshow(images[i].permute(1, 2, 0))  # Convert (C, H, W) to (H, W, C)
    ax.set_title(f"Label: {labelList[labels[i].item()]}", fontsize=10)
    ax.axis("off")  # Hide axes for cleaner visualization

plt.tight_layout()  # Adjust spacing to prevent overlap
plt.show()