import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Make sure your environment variables are properly set
endpoint = os.getenv("ENDPOINT_URL")
deployment = os.getenv("DEPLOYMENT_NAME")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

# Print the loaded variables for confirmation
print("Endpoint URL:", endpoint)
print("Deployment Name:", deployment)
print("Subscription Key:", subscription_key[:5] + "..." + subscription_key[-5:])  # Show a snippet of the key for validation

# Set up the OpenAI API client
openai.api_type = "azure"
openai.api_base = endpoint
openai.api_version = "2024-02-15-preview"
openai.api_key = subscription_key

try:
    # Example conversation prompt
    response = openai.ChatCompletion.create(
        deployment_id=deployment,
        messages=[
            {"role": "system", "content": "You are an AI health assistant specializing in nail health symptoms and diseases. Provide short, relevant, and friendly responses under 80 words. Avoid long lists unless asked."},
            {"role": "user", "content": "any advice on nail health?"}
        ],
        max_tokens=150,
        temperature=0.5
    )

    # Print the AI's response
    print(response.choices[0].message['content'])

except Exception as e:
    print(f"An error occurred: {e}")
