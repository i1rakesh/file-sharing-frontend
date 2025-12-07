#  File Sharing Frontend Client (React)

This repository contains the single-page application (SPA) client built with React. It serves as the user interface for the full-stack file sharing application, handling user interactions, routing, file management display, and secure API communication with the Node.js backend.

##  Important Note for Assessors (Backend Spin-Up Time)

This application relies on a free-tier backend service (Render), which has a sleep policy.

**Action Required:** If this is the first API call (e.g., login, register, or fetching files) after a period of inactivity (typically 15 minutes or more), the backend server may take **up to 60 seconds** to spin up and process the request. Subsequent requests will be near-instant. Please wait up to a minute for the initial request to complete.

-----

## Tech Stack & Key Components

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** | Core library for building the user interface. |
| **Routing** | **React Router DOM** | Manages client-side navigation and protected routes. |
| **State/Auth** | **React Context** | Simple, integrated state management for user authentication status. |
| **HTTP Client** | **Axios** | Used for all API communication with the Node.js backend. |
| **File Handling** | **Browser Blob API** | Used to handle the binary stream data from the backend during file downloads. |
| **UI/Styling** | **Minimal/Inline Styling** | Clean, minimal, and responsive interface design. |
| **Deployment Config** | **`vercel.json`** | Configuration file to ensure correct client-side routing and prevent 404 errors on dynamic paths. |

-----

##  Features Implemented

The frontend provides the user interface for the following features:

  * **Authentication Flow:** Minimal and centered Login and Registration pages with success/error feedback.
  * **Protected Dashboard:** Routes are protected, requiring a valid user session.
  * **File Upload Component:** Drag-and-drop interface supporting bulk uploads and client-side validation for file type and size.
  * **Dynamic File List:** Displays all owned and shared files with clean, paginated metadata:
      * Filename (truncated with full name on hover).
      * File Type, Size, Upload Date, and Owner status.
  * **Secure Download:** Handles file downloads by making an API call and creating a local Blob stream.
  * **Share Link Access:** The client-side router handles the `/share/:token` URL, validates the user's login status, and initiates the secure file download from the backend.

-----

##  Local Setup Instructions

Follow these steps to run the frontend application locally.

### 1\. Clone the Repository

```bash
git clone <your-frontend-repo-url>
cd <your-frontend-repo-folder>
```

### 2\. Install Dependencies

Install the required Node packages.

```bash
npm install
```

>  **Troubleshooting:** If `npm install` fails due to dependency conflicts, use the `--legacy-peer-deps` flag:
>
> ```bash
> npm install --legacy-peer-deps
> ```

### 3\. API Configuration (CRITICAL STEP)

The frontend needs to know where your backend server is running.

In your `src/api/axios.js` file (or wherever your `apiClient` is initialized), ensure the `baseURL` points to your **live Render backend** for testing the complete live environment, or `http://localhost:5000/api` for local development.

```javascript
// src/api/axios.js

const apiClient = axios.create({

    baseURL: 'http://localhost:5000/api', 
    // baseURL: 'https://file-sharing-backend-7h5i.onrender.com/api', 
    // ...
});
```

### 4\. Start the Application

Start the React development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

-----

## Deployment Configuration (Vercel)

The following file is included in the root of the repository to ensure client-side routing works correctly on Vercel:

### `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration tells the Vercel server to redirect all traffic to the main `index.html` file, allowing React Router to manage dynamic routes like `/share/:token` and preventing 404 errors.