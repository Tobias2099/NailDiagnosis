import openai
import os
from dotenv import load_dotenv
from flask import request, jsonify

load_dotenv()

# Make sure your environment variables are properly set
endpoint = os.getenv("ENDPOINT_URL")
deployment = os.getenv("DEPLOYMENT_NAME")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

# Set up the OpenAI API client
openai.api_type = "azure"
openai.api_base = endpoint
openai.api_version = "2024-02-15-preview"
openai.api_key = subscription_key

def chat():
    try:
        data = request.json.get("messageHistory")

        for i, msg in enumerate(data):
          if not isinstance(msg, dict) or 'role' not in msg or 'content' not in msg:
              return jsonify({'error': f'Message at index {i} is invalid: {msg}'}), 400

        system_prompt = {
            "role": "system",
            "content": "You are an AI health assistant specializing in nail health symptoms and diseases. Provide short, relevant, and friendly responses under 100 words."
        }

        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid message history format. It should be a list of messages.'}), 400
        
        messages = [system_prompt] + data


        response = openai.ChatCompletion.create(
            deployment_id=deployment,
            messages=messages,
            max_tokens=150,
            temperature=0.5
        )
        
        ai_response = response.choices[0].message['content']
        return jsonify({'response': ai_response}), 201
    except openai.error.RateLimitError as e:
      return jsonify({'error': 'Rate limit exceeded. Please slow down.'}), 429
    except Exception as e:
      return jsonify({'error': str(e)}), 500
