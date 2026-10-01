# Personal Cloud Storage

A self-hosted personal cloud storage platform inspired by Google Drive. Built with React, Node.js/Express, PostgreSQL, and MinIO/S3 object storage.

---

## Features

- **File and Folder Management**: Upload files, build nested directory hierarchies, navigate, and download items.
- **Object Storage Integration**: Scalable storage using MinIO or AWS S3 with secure, short-lived presigned URLs for preview and downloads.
- **Authentication**: JWT authentication with local registration/login and Google OAuth 2.0 integration.
- **File Sharing**: Share files via unique links with optional password protection and expiration dates.
- **Favorites and Trash**: Star important files and recover or purge deleted items via the recycle bin.
- **Storage Metrics**: Quota tracking, used storage calculation, and file/folder counters.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7, Axios |
| **Backend** | Node.js, Express 5, Multer, Passport.js, JWT, Bcrypt |
| **Database** | PostgreSQL |
| **Storage** | MinIO / AWS S3 |

---

## Project Structure

```text
Personal-Cloud-Storage/
├── client/          # React + Vite frontend
│   └── src/
│       ├── Components/  # Reusable UI components
│       ├── Pages/       # Application views
│       └── context/     # Auth state context
├── server/          # Express API server
│   ├── .env.example # Environment variable template
│   └── src/
│       ├── config/      # Database, S3, and Passport setup
│       ├── middleware/  # JWT authentication middleware
│       ├── routes/      # Auth, files, folders, dashboard, share APIs
│       └── utils/       # Storage helpers
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- MinIO (or AWS S3 bucket)

---

### 1. Server Setup

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Copy the environment configuration and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
   The backend API runs on `http://localhost:5000`.

---

### 2. Client Setup

1. Navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:5173`.

---

## API Overview

- `POST /api/auth/register` & `POST /api/auth/login` - Local user authentication
- `GET /api/auth/google` - Google OAuth authentication
- `GET /api/files` & `POST /api/files/upload` - File listing and multi-file upload
- `POST /api/files/delete` - Bulk file deletion
- `PUT /api/files/:id/star` & `PUT /api/files/:id/trash` - Star and trash management
- `GET /api/folders` & `POST /api/folders` - Folder hierarchy operations
- `POST /api/share/files/:id` - Create shared links with expiry and password
- `GET /api/dashboard/overview` - Storage quota and usage summary

---

## License

This project is licensed under the [ISC License](LICENSE).
