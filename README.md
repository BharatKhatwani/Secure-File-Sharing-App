# File Sharing API

A secure file-sharing REST API built with Node.js, Express, MongoDB, and Cloudinary. It supports user authentication, file uploads to the cloud, and secure downloads with expiry and download limits.

---

## Features
- **User Authentication**: Register and login with JWT-based authentication.
- **File Upload**: Authenticated users can upload files, which are stored on Cloudinary.
- **Secure Download**: Files can be downloaded via a unique link, with support for expiry and download limits.
- **File Metadata**: Tracks upload date, expiry, download count, and more.

---

## Tech Stack
- **Node.js** & **Express**: Backend server and routing
- **MongoDB** & **Mongoose**: Database and ODM
- **Cloudinary**: Cloud file storage
- **JWT**: Authentication
- **Multer**: File upload handling
- **dotenv**: Environment variable management

---

## Folder Structure
```
├── app.js                # Main entry point
├── controller/           # Route controllers (auth, file)
├── routes/               # API route definitions
├── models/               # Mongoose data models (User, File)
├── middlewares/          # Auth and upload middleware
├── config/               # DB and Cloudinary config
├── uploads/              # Temp upload storage (gitignored)
├── .env                  # Environment variables (not committed)
```

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd File-Sharing_API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the server**
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

---

## API Endpoints

### Authentication
- **Register**: `POST /auth/register`
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: JWT token and user info

- **Login**: `POST /auth/login`
  - Body: `{ "username": "string", "password": "string" }`
  - Response: JWT token and user info

### File Upload & Download
- **Upload File**: `POST /api/file/upload`
  - Headers: `Authorization: Bearer <token>`
  - Form Data: `file` (file to upload), `expiryDuration` (optional, ms)
  - Response: File URL, UUID, expiry date

- **Download File**: `GET /api/file/download/:uuid`
  - Response: Redirects to the file's Cloudinary URL if valid and not expired

---

## Data Models

### User
```js
{
  username: String,
  email: String,
  password: String (hashed)
}
```

### File
```js
{
  filename: String,
  path: String (Cloudinary URL),
  mimetype: String,
  size: Number,
  userId: ObjectId (User),
  uploadDate: Date,
  expiryDate: Date,
  maxDownload: Number,
  downloadCount: Number,
  uuid: String (unique)
}
```

---

## Notes
- The `/uploads` folder is used for temporary storage and is gitignored.
- All environment variables must be set for the app to function.
- Download links expire based on the `expiryDate` or after `maxDownload` is reached.
- Only authenticated users can upload files.

---

## License
ISC 