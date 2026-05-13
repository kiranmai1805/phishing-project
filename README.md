# SECURE LABS: Phishing Awareness Research Platform

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Backend-success.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)

## Overview
Secure Labs is a behavioral analysis tool engineered to quantify human vulnerability to phishing attacks. Unlike traditional phishing simulators that strictly evaluate click-through rates, this platform captures critical cognitive metrics—specifically **decision latency (time-to-verdict)** and **qualitative reasoning**. 

By analyzing these variables, the platform identifies "System 1" impulsive thinking patterns and highlights high-risk demographics across different organizational roles. The resulting datasets are designed to facilitate the development of targeted, behavior-based cybersecurity training protocols.

## Cloud Architecture & Deployment
This application was designed with modern cloud computing principles, utilizing managed services for rapid deployment and high availability.

* **Platform as a Service (PaaS):** The Node.js server and application logic are hosted and deployed via **Render**, providing automated builds directly from the GitHub repository.
* **Database as a Service (DBaaS):** Data storage is handled via **MongoDB Atlas**, ensuring high availability, secure database clustering, and decoupled cloud storage.

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

---

## Local Installation & Setup

### 1. Prerequisites
* Node.js runtime environment installed.
* Access to a MongoDB cluster (e.g., MongoDB Atlas).

### 2. Repository Initialization
```bash
git clone [https://github.com/YourUsername/phishing-research-app.git](https://github.com/YourUsername/phishing-research-app.git)
cd phishing-research-app
npm install
