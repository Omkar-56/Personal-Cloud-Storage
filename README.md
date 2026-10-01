# ☁️ Personal Cloud Storage

A modern, fast, and self-hosted personal cloud storage platform inspired by Google Drive. Built with **React**, **Node.js/Express**, **PostgreSQL**, and **MinIO / AWS S3** object storage.

---

## ✨ Features

- 📁 **File & Folder Management**: Upload multiple files, create nested directory structures, browse, and organize easily.
- ⚡ **S3-Compatible Object Storage**: Fast, scalable storage with MinIO (or AWS S3) using short-lived presigned URLs for secure downloads and previews.
- 🔐 **Authentication**: Secure JWT authentication supporting email/password sign-up and **Google OAuth 2.0**.
- 🔗 **Secure File Sharing**: Create public share links with optional **password protection** and **expiration dates**.
- ⭐ **Starred & Recycle Bin**: Bookmark important files for quick access and safely send deleted items to the trash.
- 📊 **Dashboard & Quotas**: Real-time storage quota tracking (default 5 GB), usage statistics, and file/folder counters.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7, Axios |
| **Backend** | Node.js, Express 5, Multer (Memory Storage), Passport.js, JSON Web Tokens (JWT), Bcrypt |
| **Database** | PostgreSQL (`pg`) |
| **Storage** | MinIO / AWS S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) |

---

## 📁 Project Structure

```text
Personal-Cloud-Storage/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── Components/  # UI components (FileGrid, Sidebar, FileUpload, etc.)
│   │   ├── Pages/       # Views (Home, AllFiles, Starred, RecycleBin, Settings)
│   │   └── context/     # Auth and state management
├── server/          # Node.js + Express backend
│   ├── server.js    # Entry point
│   └── src/
│       ├── config/      # DB, S3, and Passport configs
│       ├── middleware/  # JWT auth middleware
│       ├── routes/      # Auth, files, folders, dashboard, share APIs
│       └── utils/       # S3 storage helpers
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) database
- [MinIO](https://min.io/) server (or AWS S3 bucket)

---

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key

   # Database
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=cloud_storage
   DB_PASS=your_db_password
   DB_PORT=5432

   # MinIO / S3
   MINIO_ENDPOINT=http://localhost:9000
   MINIO_REGION=us-east-1
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MINIO_BUCKET=cloud-storage
   STORAGE_BACKEND=minio

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will run at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open the browser at `http://localhost:5173`.

---

## 📡 API Overview

- `POST /api/auth/register` & `POST /api/auth/login` - Local authentication
- `GET /api/auth/google` - Google OAuth authentication
- `GET /api/files` & `POST /api/files/upload` - File listing & upload
- `POST /api/files/delete` - Batch delete files
- `PUT /api/files/:id/star` & `PUT /api/files/:id/trash` - Star / trash files
- `GET /api/folders` & `POST /api/folders` - Manage nested folders
- `POST /api/share/files/:id` - Create password-protected/expiring share links
- `GET /api/dashboard/overview` - Storage metrics and counters

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
