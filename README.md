🚀 AI App Generator

A configuration-driven application generator that dynamically builds UI components (forms, tables) from JSON input.
This project demonstrates frontend architecture, dynamic rendering, and robust error handling under uncertain configurations.

📌 Features
🔹 Dynamic UI Rendering from JSON
🔹 Form Generation based on configuration
🔹 Table Rendering with live data
🔹 CSV Import (bulk data upload)
🔹 Graceful Error Handling
Invalid JSON
Missing fields
Unsupported components
🔹 Responsive UI using Tailwind CSS


🧠 How It Works
User provides a JSON configuration
System parses and validates the input
Components are dynamically mapped and rendered
Form submissions and CSV uploads update in-memory data
Table displays the updated dataset


🏗️ Architecture
Core Components
ComponentMapper
Maps JSON type → React Component
Handles unknown components safely
FormRenderer
Generates input fields dynamically
Handles user input and CSV upload
TableRenderer
Displays dynamic data in tabular format


⚠️ Error Handling

The system is designed to be fault-tolerant:

Invalid JSON → Error message shown
Missing field name → Skipped with warning
Unsupported field type → Handled gracefully
Unknown component → Fallback UI shown


📂 Sample JSON
{
  "ui": [
    {
      "type": "form",
      "fields": [
        { "name": "name", "type": "text" },
        { "name": "age", "type": "number" }
      ]
    },
    {
      "type": "table"
    }
  ]
}


📦 Tech Stack
Frontend: Next.js, React, TypeScript
Styling: Tailwind CSS
CSV Parsing: PapaParse


⚡ Getting Started
npm install
npm run dev

Open:

http://localhost:3000


🌍 Deployment

Deployed on Vercel
👉 Add your live link here after deployment

🎥 Demo
👉 Add your Loom video link here

🧠 Design Decisions & Tradeoffs
Used in-memory state instead of database for faster iteration under time constraints
Focused on robust frontend architecture and error handling
Designed system to be extensible for backend integration (APIs, DB)

🚀 Future Improvements
Backend API integration (Node.js / Next API routes)
Database support (PostgreSQL + Prisma)
Authentication system
Workflow automation

👩‍💻 Author
Samiksha Bhore