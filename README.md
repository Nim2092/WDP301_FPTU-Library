# WDP301_FPTU-Library

FPTU-Library management

Our team is developing a comprehensive library management system for FPT University to streamline the borrowing and returning of textbooks and reference materials. The website will allow students and staff to easily search for books, place orders for borrowing, and manage their accounts online. The system will include features such as catalog browsing, order tracking, renewal requests, and notifications for due dates. Additionally, users can pay fines and book-related fees securely through integrated CASSO payment functionality. The solution is designed to provide a seamless user experience while improving operational efficiency for the university’s library.

## Table of Contents

- [Movie Theater Management](#movie-theater-management)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Technologies Used](#technologies-used)
  - [Acknowledgements](#acknowledgements)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.20.2 or higher)
- [npm](https://www.npmjs.com/)

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/Nim2092/WDP391_FPTU-Library.git
   ```

2. Navigate to the backend directory:

   ```sh
   cd your-repo-name/Backend
   ```

3. Install the backend, frontend dependencies:

   ```sh
   npm install
   ```

4. Create a `.env` file and add the necessary environment variables:

   ```env
   PORT=9999
   DB_URI=your_database_uri
   JWT_SECRET=your_jwt_secret
   ```

5. Start the backend server:

   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```sh
   cd ../Frontend
   ```

2. Install the frontend dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and add the necessary environment variables:

   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. Start the frontend development server:

   ```sh
   npm start
   ```

## Technologies Used

- Node.js
- Express
- MongoDB
- React
- Others

## Acknowledgements

Thank and mention the people or resources that helped you in the project:

- Do Quang Minh (leader)
- Le Trung Anh
- Dang Manh Cuong
- Nguyen Tien Dat
