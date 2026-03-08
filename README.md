# AI Task Management App

#### A full-stack Task & Team Management application with a mini AI command assistant, built using Express, MongoDB, React, and TypeScript.

- Features

JWT Authentication & Role-based access (admin / member)

Solo & Team task management

Team creation, member management, task assignment

Task comments & activity tracking

Notifications system

AI command parser to create & assign tasks using natural language

- AI Command Example
`
Create task add table of users and assign to John
`


AI parses the command and securely executes:

Create task

Assign task to team member

AI is not a chatbot — it only parses commands and calls real APIs.

- Tech Stack

Backend: Node.js, Express, TypeScript, MongoDB, JWT
Frontend: React (Vite), TypeScript, Tailwind CSS
State: Zustand
AI: Rule-based NLP parser (free & student-friendly)

- Run Locally
# Backend
`
cd server
npm install
npm run dev
`

# Frontend
`
cd client
npm install
npm run dev
`
- Highlights

Clean REST API design

Secure role-based team access

Real-world task workflow

Applied AI (practical, not hype)

