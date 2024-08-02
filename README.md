# OAV Test Assessment

Welcome to the test assessment for OAV! This repository contains the backend for test project designed to scrape data for articles and store them in database.

## Overview

- **Backend**: Built on Nest and Postgresql using Prisma ORM for efficient data handling.

## Repository

You can find the source code for this application at the following GitHub repository:

[GitHub Repository Link](https://github.com/Ninja-Dev007/OAV-test-assessment)

### Available API Routes

The backend has following routes:

- **GET /articles**: This route is used to extract articles from the database.

- **GET /articles/:id**: This route is used to extract article by id from the database.

- **POST /articles**: This route is used to create a new article in the database.

- **PATCH /articles/:id**: This route is used to update article in the database.

- **DELETE /articles/:id**: This route is used to delete article in the database.

- **GET /articles/scrape**: This route is used to scrape articles data from third party api and store them in the datbase.

- **GET /doc**: Provides the Swagger documentation for the API.

## Technologies Used

- **Backend**:
  - NestJs: A web application framework for Node.js, used for building APIs and handling HTTP requests.
  - Prisma: An ORM (Object-Relational Mapping) for Node.js, used for interacting with databases.
  - PostgreSql: A fully managed database service that supports relational workloads. It is designed for storing complex, document-oriented data structures at scale, offering robust features for high availability, durability, and security.

## Configuration

### Environment Variables

This project uses environment variables for configuration. You can configure these variables by creating a `.env` file in the root of your project.

Here is an example `.env` file:

- `APP_PORT`: The port on which the application will run.
- `DATABASE_URL`: The URL of your PostgreSQL database.

### Setup Instructions

To run the App locally, follow these steps:

1. **Install Dependencies**:

- Run following command in root folder:
  ```
  npm install
  ```

3. **Start Backend**:

- For development mode:
  ```
  npm run start:dev
  ```
- For production mode:
  ```
  npm run start:prod
  ```

5. **Access the Application**:

- Once server is running, you can access the App by navigating to `http://localhost:8080` in your web browser.
