# SECURE LABS: Phishing Awareness Research Platform

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Backend-success.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)

## Project Overview
This application is a behavioral analysis tool engineered to quantify human vulnerability to social engineering and phishing attacks. Unlike traditional phishing simulators that strictly evaluate click-through rates, this platform captures critical cognitive metrics—specifically decision latency (time-to-verdict) and qualitative reasoning. 

By analyzing these variables, the platform identifies "System 1" impulsive thinking patterns and highlights high-risk demographics across different organizational roles. The resulting datasets are designed to facilitate the development of targeted, behavior-based cybersecurity training protocols.

## Cloud Architecture & Deployment
This application was designed with modern cloud computing principles, utilizing managed services for rapid deployment and high availability.

* **Platform as a Service (PaaS):** The Node.js server and application logic are hosted and deployed via Render, providing automated builds directly from the GitHub repository.
* **Database as a Service (DBaaS):** Data storage is handled via MongoDB Atlas, ensuring high availability, secure database clustering, and decoupled cloud storage.

## Technical Stack
* **Frontend Application:** HTML5, CSS3, Vanilla JavaScript (DOM Manipulation)
* **Backend Runtime Environment:** Node.js, Express.js
* **Database Object Modeling:** MongoDB via Mongoose ODM
* **Data Formatting:** `json2csv` for flattened tabular data export

## Core Features
1. **Interactive Simulation Environment:** Users evaluate 10 realistic email scenarios to determine legitimacy based on visual and textual indicators.
2. **Behavioral Metric Tracking:** The system automatically calculates and records the exact millisecond latency between viewing an email and rendering a verdict.
3. **Qualitative Data Capture:** Enforces mandatory explanation fields to expose underlying security mental models and identify training gaps.
4. **Role-Based Segmentation:** Categorizes participant data by academic/administrative role (Student, Faculty, Staff) for demographic risk profiling.
5. **Anti-Duplication Protocols:** Implements local storage validation to prevent duplicate submissions and ensure dataset integrity.
6. **Secure Administration Dashboard:** Provides password-protected endpoints for real-time data export into wide-format CSV files for statistical analysis.

## Local Installation & Setup

### Prerequisites
* Node.js runtime environment installed.
* Access to a MongoDB cluster (e.g., MongoDB Atlas free tier).

### Repository Initialization
git clone https://github.com/YourUsername/phishing-research-app.git
cd phishing-research-app
npm install

### Environment Configuration
Create a `.env` file in the project root directory containing the following variables:
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/PhishingData
ADMIN_PASS=your_secure_password
PORT=3000

### Server Execution
npm start

The application will initialize on `http://localhost:3000`.

## Administrative Endpoints & Usage

### Developer Bypass Mode
To bypass the anti-duplication local storage block during testing, append the mode parameter to the root URL:
`http://localhost:3000/?mode=test`

### Data Export & Management
Access to the following routes requires appending the `ADMIN_PASS` environment variable to the query string.

* **Global Data Export (CSV format):**
  `/admin/download?pass=YOUR_ADMIN_PASS`
* **Targeted Role Export:**
  `/admin/download?pass=YOUR_ADMIN_PASS&role=Student`
* **Database Reset (Destructive Action):**
  `/admin/reset-database?pass=YOUR_ADMIN_PASS`

## Dataset Structure
The application exports a flattened CSV optimized for ingestion into analytical tools (e.g., Python, R, Excel). Data attributes include:
* **Demographics:** `Student_Name_ID`, `Role`, `Age`, `Gender`
* **Scenario Data:** `Q1_Image` through `Q10_Image`
* **User Verdicts:** `Q1_Verdict` through `Q10_Verdict`
* **Qualitative Reasoning:** `Q1_Reason` through `Q10_Reason`
* **Cognitive Latency:** `Q1_Time(sec)` through `Q10_Time(sec)`

---
*Notice: This tool was developed strictly for authorized academic research and organizational security assessment purposes.*
