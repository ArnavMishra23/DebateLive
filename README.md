# DebateLive 🎙️

![GitHub repo size](https://img.shields.io/github/repo-size/ArnavMishra23/DebateLive?color=blue)
![GitHub stars](https://img.shields.io/github/stars/ArnavMishra23/DebateLive?style=social)
![License](https://img.shields.io/github/license/ArnavMishra23/DebateLive)

> A real-time platform for hosting, joining, and experiencing live debates from anywhere in the world.

---

## 🚀 Features
- 🎥 **Real-time live debates** powered by **Fluvio**.
- 📅 **Upcoming debates** with filterable schedules.
- 🔎 **Search** debates by topic, speaker, or date.
- 🎨 **Modern, responsive design** with HTML, CSS, and JavaScript.
- ⚡ **Fast performance** without heavy frameworks.
- 🔧 **Scalable Node.js backend** integration.

---

## 🛠️ Tech Stack

| Frontend            | Backend  | Streaming | Hosting                         |
|---------------------|----------|-----------|---------------------------------|
| HTML, CSS, JavaScript| Node.js  | Fluvio    | GitHub Pages / Render / Custom |

---

## 🧩 Folder Structure

```
debate-live-backend/
├── node_modules/            # Node.js dependencies
├── public/                   # Frontend public files
│   ├── images/               # Images
│   ├── index.html            # Home page
│   ├── about.css             # About page styles
│   ├── improved-style.css    # General styles
│   ├── livedebates.html      # Live debates page
│   ├── livedebates.css       # Live debates styles
│   ├── schedulepage.html     # Schedule page
│   ├── schedulepage.css      # Schedule page styles
│   ├── statistics.html       # Statistics page
│   └── statistics.css        # Statistics styles
├── server/                   # Backend server files
│   ├── server.js             # Main server file
│   └── server-fluvio.js      # Fluvio streaming server
├── package.json              # Project metadata and scripts
├── package-lock.json         # Exact dependency versions
├── test-fluvio.js            # Fluvio streaming test
└── tsconfig.json             # TypeScript configuration (optional)
```

---

## ⚙️ Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArnavMishra23/DebateLive.git
   cd DebateLive
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   npm start
   ```

3. **Open the frontend**
   - Locate the `index.html` file inside the `public/` directory.
   - Right-click and choose **"Open with Browser"**.

4. *(Optional)* **Use a local server for frontend**

   - **Using VSCode Extension**:  
     Install the **Live Server** extension and click "Go Live".

   - **Using Python HTTP Server**:  
     ```bash
     python3 -m http.server
     ```
     Then visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements
- Huge thanks to **Fluvio** for real-time data streaming support.
- Designed and developed with ❤️ by **Arnav Mishra**.

