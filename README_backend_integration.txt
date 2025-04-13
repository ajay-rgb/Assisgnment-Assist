# Backend Integration Guide

## Overview
This backend is designed for plagiarism detection in assignments. It uses Express.js for the server, Prisma for database management, and Python scripts for similarity checks.

### Key Components
1. **Express.js Server**:
   - Handles HTTP requests.
   - Provides endpoints for file uploads and retrieving assignments.

2. **Prisma ORM**:
   - Manages the database schema and queries.
   - Stores assignment text and SimHash values.

3. **Python Scripts**:
   - Performs plagiarism detection using SimHash and Hamming distance.

4. **File Uploads**:
   - Files are uploaded via the `POST /assignments` endpoint and stored temporarily in the `uploads/` directory.

### Endpoints
1. **POST /assignments**:
   - Accepts a file upload.
   - Processes the file and checks for plagiarism against previously submitted assignments.
   - Returns plagiarism results as JSON.

2. **GET /assignments**:
   - Retrieves all stored assignments and their plagiarism results.

### Database
- **Schema**:
  - Defined in `schema.prisma`.
  - Contains an `Assignment` model with fields for `id`, `text`, and `simhash`.
- **Setup**:
  - Configure the database URL in the `.env` file.
  - Run `npx prisma migrate dev --name init` to set up the database.

### Integration Steps
1. **Setup**:
   - Clone the repository and navigate to the `backend/` directory.
   - Install dependencies using `npm install`.
   - Set up the database as described above.

2. **Run the Server**:
   - Start the server with `npm start`. It will run on `http://localhost:3000`.

3. **API Usage**:
   - Use the `POST /assignments` endpoint to upload assignments for plagiarism detection.
   - Use the `GET /assignments` endpoint to fetch all assignments and their plagiarism results.

4. **Frontend Integration**:
   - Ensure the frontend application makes API calls to the backend endpoints.
   - For file uploads, use a library like Axios to send `multipart/form-data` requests.

5. **Python Script**:
   - Ensure Python and required libraries (e.g., `numpy`, `scipy`, `sklearn`) are installed.
   - The script processes text data and calculates similarity scores.

### Notes
- The backend is modular and can integrate with any frontend or external system.
- Secure the API with authentication for production use.
- Deploy the backend on a cloud platform for scalability.