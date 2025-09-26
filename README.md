# FoodieApp - Restaurant Management Platform

This is a full-stack application built with React and Manifest. It allows restaurant owners to sign up, create their restaurant profiles, and manage their menu items.

## ✨ Features

- **User Authentication**: Secure sign-up and login for restaurant owners.
- **Restaurant Management**: Create, view, update, and delete restaurant profiles.
- **Menu Management**: Add, view, update, and delete menu items for each restaurant.
- **Ownership Policies**: Users can only manage the restaurants and menu items they own.
- **Auto-generated Admin Panel**: A complete admin interface for managing all data, users, and settings, available at `/admin`.

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Manifest (SQLite, REST API, Authentication, Storage)
- **SDK**: `@mnfst/sdk` for seamless frontend-backend communication.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd foodie-app
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory and add the URL of your deployed Manifest backend:

    ```env
    VITE_BACKEND_URL=https://your-manifest-backend-url.vercel.app
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

### 🔑 Default Credentials

- **Demo User**: `owner@foodieapp.com` / `password123`
- **Admin Panel**: `admin@manifest.build` / `admin` (Access at `${BACKEND_URL}/admin`)
