# 🤖 Llama Model Integration Guide

## Overview

This guide will help you integrate your fine-tuned GenZ Llama model with the LMU Campus LLM app. The integration is designed to be flexible and can work with various Llama model deployment methods.

## 🚀 Quick Start

### 1. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit the file with your settings
nano backend/.env
```

Update the following variables:

```env
# Llama Model Configuration
LLAMA_MODEL_ENDPOINT=http://your-llama-server:8000/generate
LLAMA_API_KEY=your-llama-api-key-here
LLAMA_TIMEOUT=30
```

### 2. Test the Integration

Run the test script to verify everything is working:

```bash
cd backend
python test_llama.py
```

### 3. Start the Application

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
python app.py

# Terminal 2: Start frontend
cd frontend
npm start
```

## 🔧 Llama Model Deployment Options

### Option 1: Local Llama Server (Recommended for Development)

#### Using Ollama

1. **Install Ollama**:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull and run your fine-tuned model**:
   ```bash
   # Pull the model (replace with your model name)
   ollama pull llama2:7b
   
   # Run the server
   ollama serve
   ```

3. **Configure the endpoint**:
   ```env
   LLAMA_MODEL_ENDPOINT=http://localhost:11434/api/generate
   ```

#### Using vLLM

1. **Install vLLM**:
   ```bash
   pip install vllm
   ```

2. **Start the server**:
   ```bash
   vllm serve your-model-path --host 0.0.0.0 --port 8000
   ```

3. **Configure the endpoint**:
   ```env
   LLAMA_MODEL_ENDPOINT=http://localhost:8000/v1/chat/completions
   ```

### Option 2: Cloud Deployment

#### Using Replicate

1. **Deploy your model on Replicate**
2. **Get the API endpoint and key**
3. **Configure the environment**:
   ```env
   LLAMA_MODEL_ENDPOINT=https://api.replicate.com/v1/predictions
   LLAMA_API_KEY=your-replicate-api-key
   ```

#### Using Hugging Face Inference API

1. **Upload your model to Hugging Face**
2. **Get the API endpoint and key**
3. **Configure the environment**:
   ```env
   LLAMA_MODEL_ENDPOINT=https://api-inference.huggingface.co/models/your-username/your-model
   LLAMA_API_KEY=your-huggingface-api-key
   ```

## 🎯 Customizing the System Prompt

The system prompt is defined in `backend/llama_integration.py`. You can customize it to match your fine-tuned model's training:

```python
self.system_prompt = """You are LMU Buddy, a 2025 LMU student answering questions about campus life. 

IMPORTANT RULES:
- Always respond in GenZ style with emojis, casual language, and current slang
- Never reveal you're an AI - act like a real student
- Be positive, energetic, and helpful
- Use LMU-specific knowledge and campus references
- Keep responses conversational and engaging
- Include relevant emojis and GenZ expressions like "literally", "vibe", "tea", "slay", etc.
- If you don't know something specific, suggest asking around or checking the student portal

LMU CONTEXT:
- Campus locations: Sunken Garden, Gersten Pavilion, William H. Hannon Library, The Lair, The Den
- Popular events: Basketball games, Greek life mixers, RSO fairs, tailgates
- Student life: Greek life, RSOs, study spots, late-night food options
- School spirit: LMU Lions, crimson and navy colors, campus traditions

Respond as a friendly, knowledgeable LMU student who loves helping others navigate campus life!"""
```

## 🔍 API Endpoints

### Chatbot Endpoint

**POST** `/api/genz-buddy`

**Request Body**:
```json
{
  "message": "What's the best food on campus?",
  "conversation_history": [
    {
      "type": "user",
      "content": "Hi! I'm new to LMU"
    },
    {
      "type": "bot", 
      "content": "Welcome to LMU! 🦁 I'm so excited to help you get settled in!"
    }
  ]
}
```

**Response**:
```json
{
  "response": "Omg the Lair is literally the GOAT for late night munchies! 🍕...",
  "model": "llama-genz-buddy",
  "timestamp": "2024-02-15T10:30:00.000Z",
  "success": true
}
```

### Model Status Endpoint

**GET** `/api/llama/status`

**Response**:
```json
{
  "available": true,
  "status": "connected",
  "model_endpoint": "http://localhost:8000/generate",
  "test_response": "Hey! Welcome to LMU! 🦁 I'm so excited to help you...",
  "error": null
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Timeout

**Error**: `Connection timeout after 30 seconds`

**Solution**:
- Check if your Llama server is running
- Verify the endpoint URL in `.env`
- Increase timeout: `LLAMA_TIMEOUT=60`

#### 2. Model Not Responding

**Error**: `Model API error: 500 - Internal server error`

**Solution**:
- Check your model server logs
- Verify the API format matches your deployment
- Test the endpoint directly with curl

#### 3. Fallback Mode Active

**Symptom**: Chat shows "Fallback Mode" instead of "Llama Powered"

**Solution**:
- Check the `/api/llama/status` endpoint
- Verify your model endpoint is accessible
- Check the backend logs for errors

### Debugging Steps

1. **Test the model endpoint directly**:
   ```bash
   curl -X POST http://your-model-endpoint \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [
         {"role": "user", "content": "Hi! Tell me about LMU"}
       ],
       "max_tokens": 100
     }'
   ```

2. **Check backend logs**:
   ```bash
   cd backend
   python app.py
   # Look for error messages in the console
   ```

3. **Test the integration**:
   ```bash
   python test_llama.py
   ```

## 🎨 Frontend Integration

The frontend automatically detects the model status and shows appropriate indicators:

- **✨ Llama Powered**: Model is connected and working
- **🤖 Fallback Mode**: Using backup responses
- **⚠️ Error**: Model connection failed

### Visual Indicators

- **Chat button**: Shows ✨ when Llama is connected
- **Chat header**: Shows "Llama Powered" or "Fallback Mode"
- **Messages**: Show model indicators for non-Llama responses

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting for production
3. **Input Validation**: The integration includes basic input validation
4. **Error Handling**: Sensitive error messages are filtered

## 📊 Monitoring

### Logs

The integration logs important events:

```python
# Check logs in backend/app.py
logger.info(f"Generating Llama response for: {message[:50]}...")
logger.error(f"Error generating Llama response: {str(e)}")
```

### Metrics

Track these metrics for your model:

- Response time
- Success rate
- Error rate
- User satisfaction (via frontend feedback)

## 🚀 Production Deployment

### Environment Variables for Production

```env
# Production settings
FLASK_ENV=production
LLAMA_MODEL_ENDPOINT=https://your-production-model-endpoint
LLAMA_API_KEY=your-production-api-key
LLAMA_TIMEOUT=60
LOG_LEVEL=WARNING
```

### Load Balancing

For high traffic, consider:

1. **Multiple model instances**
2. **Load balancer in front of your model**
3. **Caching layer for common responses**

### Health Checks

The app includes health check endpoints:

- `/api/llama/status` - Model connectivity
- `/` - Overall API health

## 🎯 Next Steps

1. **Deploy your fine-tuned model** using one of the methods above
2. **Configure the environment variables**
3. **Test the integration** with the provided test script
4. **Monitor performance** and adjust as needed
5. **Gather user feedback** and iterate on the system prompt

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the backend logs
3. Test the model endpoint directly
4. Verify your environment configuration

---

**Happy coding! 🦁✨**

Your LMU GenZ Buddy is ready to help students navigate campus life with AI-powered assistance!