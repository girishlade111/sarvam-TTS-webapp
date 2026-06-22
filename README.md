# sarvam-TTS-webapp

> Full-stack Text-to-Speech web app using the Sarvam AI TTS API

A monorepo containing a Node.js backend (`backend/`) that proxies the Sarvam AI Text-to-Speech API and a separate frontend (`frontend/`) that consumes it. Designed as a clean two-service architecture ready for local development and easy deployment.

🔗 **Live repo:** <https://github.com/girishlade111/sarvam-TTS-webapp>

## ✨ Features

- Backend proxy for the Sarvam AI TTS REST API (hides API keys)
- Independent frontend service — no monorepo coupling
- Per-service `package.json` and lockfiles for clean dependency boundaries
- `.env` based config for API keys
- Ready to extend with streaming responses and SSML

## 🛠️ Tech stack

Node.js • Express • JavaScript (Frontend) • HTML/CSS/JS • Sarvam AI TTS API

## 🚀 Getting started

```bash
# Backend
cd backend
npm install
# Set SARVAM_API_KEY in backend/.env
npm start

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## 📁 Project structure

```
.
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env             # SARVAM_API_KEY lives here
└── frontend/
    ├── public/
    ├── index.html
    └── package.json
```

## 🤝 Contributing

Bug reports and pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License

Check the repository for the license file. If none is present, treat as "all rights reserved" by the author.

---

Built by [Girish Lade](https://github.com/girishlade111) · Part of the [LadeStack](https://ladestack.in) open-source collection.
