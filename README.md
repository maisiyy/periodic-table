# 🌐 3D Data Visualizer (Three.js + Google Sheets)

![Project Banner](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Three.js-Black?style=for-the-badge&logo=three.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

An interactive web application that transforms raw CSV data from Google Sheets into stunning, navigable 3D structures. This project demonstrates advanced DOM manipulation using the `CSS3DRenderer` to render HTML elements in a 3D space.

## ✨ Key Features

* **🔐 Secure Authentication:** Integrated Google OAuth 2.0 to securely sign in and access private spreadsheet data.
* **📊 Live Data Fetching:** Uses the Google Sheets API to pull real-time data (Names, Photos, Net Worth) directly into the 3D scene.
* **🎨 Dynamic Styling:** Cards are automatically color-coded based on specific data thresholds (Red < $100k | Orange > $100k | Green > $200k).
* **💠 Interactive Layouts:** Seamlessly morph between four distinct 3D formations using TWEEN.js:
    * **Table:** A classic periodic table arrangement (20x10).
    * **Sphere:** A mathematically distributed 3D globe.
    * **Double Helix:** A DNA-like spiral structure (split strands).
    * **Grid:** A deep 3D block arrangement (5x4x10).

## 🛠️ Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
* **3D Engine:** [Three.js](https://threejs.org/) (CSS3DRenderer)
* **Animation:** [Tween.js](https://github.com/tweenjs/tween.js/)
* **Backend/API:** Google Cloud Platform, Google Sheets API v4
* **Controls:** TrackballControls

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/periodic-table.git](https://github.com/yourusername/periodic-table.git)
    ```
2.  **Open in VS Code**
    ```bash
    cd periodic-table
    code .
    ```
3.  **Launch with Live Server**
    * Right-click `index.html` and select **"Open with Live Server"**.
    * *Note: This project requires a local server to handle CORS and Google Auth policies.*

