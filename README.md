# farmersonBackend-node

# Farmerson Backend

## Overview

Farmerson Backend is a Node.js-based backend service built using Express and PostgreSQL, with Supabase as the database management solution. The project supports file uploads, environment variable configuration, and Cross-Origin Resource Sharing (CORS) for API requests.

## Features

- **Express.js** for building RESTful APIs
- **Supabase** integration for database operations
- **PostgreSQL** as the primary database
- **Multer** for handling file uploads
- **CORS** support for cross-origin requests
- **Environment variable management** using Dotenv
- **Nodemon** for automatic server restarts in development

## Installation

1. Clone the repository:

   ```sh
   git clone git remote add origin https://github.com/JeevanK-Work/farmersonBackend-node.git
   cd farmerson-be
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and configure environment variables:

   ```sh
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   DATABASE_URL=your_postgresql_url
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

```
farmeron-be/
│-- src/
│   ├── server.js     # Main entry point
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── models/       # Database models
│   ├── middleware/   # Middleware functions
│   ├── config/       # Configuration files
│-- .env      # Example environment variables
│-- package.json      # Project dependencies & scripts
│-- README.md         # Documentation
```

## API Endpoints

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/`       | Welcome route       |
| POST   | `/upload` | Upload a file       |
| GET    | `/data`   | Fetch database data |

## Dependencies

- [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Multer](https://github.com/expressjs/multer)
- [Dotenv](https://github.com/motdotla/dotenv)
- [CORS](https://github.com/expressjs/cors) ....

## License

This project is licensed under the ISC License.

## Author

Farmerson
