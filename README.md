# Chatbot UI

A lightweight and modern chat interface for LLM interactions with Markdown support!

👉 Looking for a version with web search integration?   
Check out the [`websearch_template`](https://github.com/ChristophHandschuh/chatbot-ui/tree/websearch_template) branch, which includes contributions from [CameliaK](https://github.com/CameliaK)

WebSocket connection refactured by [GBG7](https://github.com/GBG7)

## Overview

A minimalist chat interface built with React and TypeScript, designed to be easily integrated with any LLM backend. Features a clean and modern design.

![Demo](demo/image.png)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/ChristophHandschuh/chatbot-ui.git
cd chatbot-ui
```

2. Install dependencies
```bash
npm i
```

3. Start the development server
```bash
npm run dev
```

## Configuration

The frontend expects a backend that exposes a `/material_chat` endpoint.  
Provide the backend base URL via the `VITE_API_BASE_URL` environment variable (see `.env.example`).

- Local development: create an `.env.local` file with `VITE_API_BASE_URL=http://localhost:54859`.
- Production build: set the same variable before running `npm run build` or pass it as a Docker build argument.

## Deployment

### Manual build

```bash
VITE_API_BASE_URL=https://your-backend-host npm run build
npm run serve  # serves dist/ on port 8501
```

### Docker (recommended)

```bash
cp .env.example .env   # adjust VITE_API_BASE_URL to your backend
docker compose up --build -d
# App becomes available on http://localhost:9383
```

## Test Mode

The project includes a test backend for development and testing purposes. To use the test mode:

1. Navigate to the testbackend directory
2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```
3. Install the required package:
```bash
pip install websockets
```
4. Run the test backend:
```bash
python test.py
```

## Credits

This project was built by:
- [Leon Binder](https://github.com/LeonBinder)
- [Christoph Handschuh](https://github.com/ChristophHandschuh)

Additional contribution by:
- [CameliaK](https://github.com/CameliaK) – Implemented web search and integrated it into the LLM prompt

Some code components were inspired by and adapted from [Vercel's AI Chatbot](https://github.com/vercel/ai-chatbot).

## License

This project is licensed under the Apache License 2.0. Please note that some components were adapted from Vercel's open source AI Chatbot project.
