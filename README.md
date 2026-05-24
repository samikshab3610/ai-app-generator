# 🚀 AI App Generator  

🔗 **Live Demo:** https://ai-app-generator-beta.vercel.app/  

A configuration-driven application generator that dynamically builds UI components (forms, tables) from JSON input.  
This project demonstrates dynamic frontend architecture, system design thinking, and robust error handling.

---

## 📌 Features

- Dynamic UI Rendering from JSON  
- Form Generation based on configuration  
- Table Rendering with live data  
- CSV Import (bulk data upload)  
- Graceful Error Handling  
  - Invalid JSON  
  - Missing fields  
  - Unsupported components  
- Responsive UI using Tailwind CSS  

---

## 🧠 How It Works

1. User provides a JSON configuration  
2. System parses and validates the input  
3. Components are dynamically mapped and rendered  
4. Form submissions and CSV uploads update in-memory data  
5. Table displays the updated dataset  

---

## 🏗️ Architecture

### ComponentMapper
- Maps JSON `type` → React Component  
- Handles unknown components safely  

### FormRenderer
- Dynamically generates input fields  
- Handles user input and CSV upload  

### TableRenderer
- Displays structured data dynamically  

---

## ⚠️ Error Handling

- Invalid JSON → Error message displayed  
- Missing field name → Skipped with warning  
- Unsupported field type → Handled gracefully  
- Unknown component → Fallback UI shown  

👉 **System never crashes due to bad configuration**

---

## 📂 Sample JSON

```json
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
```

---


## 📦 Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PapaParse

---

## ⚡ Getting Started

```bash
npm install
npm run dev
```

- Open: http://localhost:3000

--- 

## 🌍 Deployment
- 🔗 https://ai-app-generator-beta.vercel.app/

## 🎥 Demo


---

## 🧠 Design Decisions & Tradeoffs

- Used in-memory state instead of database for fast development
- Focused on reliability and error handling
- Added basic backend runtime (API route)
- Designed for future backend + DB extension

---

## 🚀 Future Improvements

- Backend API integration
- Database (PostgreSQL + Prisma)
- Authentication
- Workflow automation

---

### 👩‍💻 Author

- Samiksha Bhore
