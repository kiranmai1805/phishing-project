Phishing Awareness Research Platform: Behavioral Analysis and Simulation

Version: 1.0.0
Project Scope: Cloud Application Deployment & Cybersecurity Human Risk Assessment

Project Overview

This application is a behavioral analysis tool engineered to quantify human vulnerability to social engineering and phishing attacks. Unlike traditional phishing simulators that strictly evaluate click-through rates, this platform captures critical cognitive metrics—specifically decision latency (time-to-verdict) and qualitative reasoning.

By analyzing these variables, the platform identifies "System 1" impulsive thinking patterns and highlights high-risk demographics across different organizational roles. The resulting datasets are designed to facilitate the development of targeted, behavior-based cybersecurity training protocols.

Cloud Architecture & Deployment

This application was designed with modern cloud computing principles, utilizing a decoupled architecture and automated deployment pipelines.

Platform as a Service (PaaS): The application runtime is hosted on Render, providing automated scaling and secure HTTPS access.

Continuous Deployment (CD): Integrated directly with GitHub version control. Commits pushed to the primary branch automatically trigger server builds and live deployments without manual intervention.

Database as a Service (DBaaS): Data persistence is handled via MongoDB Atlas. This separates the application logic from the database layer, ensuring high availability and secure cloud storage.

Technical Stack

Frontend Application: HTML5, CSS3, Vanilla JavaScript (DOM Manipulation)

Backend Runtime Environment: Node.js, Express.js

Database Object Modeling: MongoDB via Mongoose ODM

Data Formatting: json2csv for flattened tabular data export

Core Features

Interactive Simulation Environment: Users evaluate 10 realistic email scenarios to determine legitimacy based on visual and textual indicators.

Behavioral Metric Tracking: The system automatically calculates and records the exact millisecond latency between viewing an email and rendering a verdict.

Qualitative Data Capture: Enforces mandatory explanation fields to expose underlying security mental models and identify training gaps.

Role-Based Segmentation: Categorizes participant data by academic/administrative role (Student, Faculty, Staff) for demographic risk profiling.

Anti-Duplication Protocols: Implements local storage validation to prevent duplicate submissions and ensure dataset integrity.

Secure Administration Dashboard: Provides password-protected endpoints for real-time data export into wide-format CSV files for statistical analysis.

Local Installation & Setup

Prerequisites

Node.js runtime environment installed.

Access to a MongoDB cluster (e.g., MongoDB Atlas).

Repository Initialization

git clone [Your_Repository_URL]
cd phishing-research-app
npm install


Environment Configuration

Create a .env file in the project root directory containing the following variables:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/PhishingData
ADMIN_PASS=your_secure_password
PORT=3000


Server Execution

npm start


The application will initialize on http://localhost:3000.

Administrative Endpoints & Usage

Developer Bypass Mode

To bypass the anti-duplication local storage block during testing, append the mode parameter to the root URL:
https://[YOUR_RENDER_URL]/?mode=test

Data Export & Management

Access to the following routes requires appending the ADMIN_PASS environment variable to the query string.

Global Data Export (CSV format):
/admin/download?pass=YOUR_ADMIN_PASS

Targeted Role Export:
/admin/download?pass=YOUR_ADMIN_PASS&role=Student

Database Reset (Destructive Action):
/admin/reset-database?pass=YOUR_ADMIN_PASS

Dataset Structure

The application exports a flattened CSV optimized for ingestion into analytical tools (e.g., Python, R, Excel). Data attributes include:

Demographics: Student_Name_ID, Role, Age, Gender, Date

Scenario Data: Q1_Image through Q10_Image

User Verdicts: Q1_Verdict through Q10_Verdict

Qualitative Reasoning: Q1_Reason through Q10_Reason

Cognitive Latency: Q1_Time(sec) through Q10_Time(sec)

Notice: This tool was developed strictly for authorized academic research and organizational security assessment purposes.
