# DebateLive 🎙️

![GitHub repo size](https://img.shields.io/github/repo-size/ArnavMishra23/DebateLive?color=blue)
![GitHub stars](https://img.shields.io/github/stars/ArnavMishra23/DebateLive?style=social)
![License](https://img.shields.io/github/license/ArnavMishra23/DebateLive)

> A real-time platform for hosting, joining, and experiencing live debates from anywhere in the world.

---

## ✨ Features

- 🔴 **Real-time live debates** powered by Fluvio
- 📅 **Upcoming debates schedule** with filters
- 🔍 **Search debates** by topic, speaker, or date
- 🧩 **Modern, responsive design** with HTML, CSS, and JavaScript
- ⚡ **Fast performance** without heavy frameworks
- 🛠️ **Node.js backend** integration for future scalability

---

## 🛠️ Tech Stack

| Frontend         | Backend   | Streaming | Hosting         |
|:----------------:|:---------:|:---------:|:----------------:|
| HTML, CSS, JavaScript | Node.js  | Fluvio    | (GitHub Pages / Render / Your Hosting) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   git clone https://github.com/ArnavMishra23/DebateLive.git
   cd DebateLive
   
2.Install backend dependencies
cd server
npm install
npm start

3.Open the frontend
Locate the index.html file inside the project root.
Right-click and choose Open with → Browser.

4.(Optional): Use a local server for frontend:
# Using VSCode extension 'Live Server'
# Or Python's simple HTTP server
python3 -m http.server

5.Visit
http://localhost:8000

📁 Folder Structure
debate-live-backend2/
├── node_modules/       # Node.js modules
├── public/             # Frontend public files
│   ├── Images/         # Images and icons
│   ├── about.css
│   ├── about.html
│   ├── about.js
│   ├── improved-style.css
│   ├── index.html      # Home page
│   ├── livedebates.css
│   ├── livedebates.html
│   ├── livedebates.js
│   ├── schedulepage.css
│   ├── schedulepage.html
│   ├── schedulepage.js
│   ├── script.js
│   ├── statistics.css
│   ├── statistics.html
│   ├── statistics.js
│   ├── style.css
├── server/             # Backend server files
│   ├── server.js
│   ├── voting.js
├── package.json        # Node.js dependencies
├── package-lock.json   # Dependency lock file
├── test-fluvio.js      # Fluvio streaming test
├── tsconfig.json       # TypeScript configuration (optional)


📜 License
This project is licensed under the MIT License.

🙌 Acknowledgements
Special thanks to Fluvio for real-time data streaming support.
Designed and developed with ❤️ by Arnav Mishra.

