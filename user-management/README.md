# User Management API

This project is a RESTful API for managing user registration, authentication, and profile management built using Node.js and NestJS.
This project implements a user management API using NestJS, featuring user registration, JWT-based authentication, profile management, and logout functionality using blacklist tokens. Users can register, log in to receive a token, access their profile, update it, change their password, and log out. The application follows a modular architecture, uses DTOs for data validation, and incorporates security password hashing. Future improvements are mentioned below.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm

### Installation
Navigate to the project directory and install dependencies:

   ```bash
   cd api
   npm install
   ```


### Running the project
   ```bash
   npm run start:dev
   ```
   The server starts at http://localhost:3000

### Running the tests
Run the following command
```bash
npm run test
```  

### API Endpoints Usage Flow
[Developed with Chatgpt]
This section outlines the typical flow for interacting with the API endpoints implemented in this project. Below is a step-by-step guide:

1. **Register a New User**
   - **Endpoint**: `POST /api/users/register`
   - **Description**: Register a new user with a username and password.
   - **Request Body**:
     ```json
     {
       "username": "newuser",
       "password": "userpassword"
     }
     ```

2. **Log In**
   - **Endpoint**: `POST /api/auth/login`
   - **Description**: Authenticate a user and receive a JWT token for accessing protected routes.
   - **Request Body**:
     ```json
     {
       "username": "newuser",
       "password": "userpassword"
     }
     ```
   - **Response**:
     ```json
     {
       "access_token": "jwt_token_here"
     }
     ```

3. **Get User Profile**
   - **Endpoint**: `GET /api/users/profile`
   - **Description**: Retrieve the profile information of the authenticated user.
   - **Headers**: Include the `Authorization: Bearer <access_token>` header.
   - **Response**:
     ```json
     {
       "id": 1,
       "username": "newuser",
       "createdAt": "2023-08-04T12:34:56.789Z",
       "updatedAt": "2023-08-04T12:34:56.789Z"
     }
     ```

4. **Update User Profile**
   - **Endpoint**: `PATCH /api/users/profile`
   - **Description**: Update the authenticated user's profile information.
   - **Headers**: Include the `Authorization: Bearer <access_token>` header.
   - **Request Body**:
     ```json
     {
       "username": "updateduser"
     }
     ```
   - **Response**:
     ```json
     {
       "id": 1,
       "username": "updateduser",
       "createdAt": "2023-08-04T12:34:56.789Z",
       "updatedAt": "2023-08-04T13:45:12.345Z"
     }
     ```

5. **Change Password**
   - **Endpoint**: `PATCH /api/users/change-password`
   - **Description**: Change the password of the authenticated user.
   - **Headers**: Include the `Authorization: Bearer <access_token>` header.
   - **Request Body**:
     ```json
     {
       "currentPassword": "userpassword",
       "newPassword": "newpassword"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Password changed successfully"
     }
     ```

6. **Log Out**
   - **Endpoint**: `POST /api/auth/logout`
   - **Description**: Log out the authenticated user by blacklisting the current JWT token.
   - **Headers**: Include the `Authorization: Bearer <access_token>` header.
   - **Response**:
     ```json
     {
       "message": "Logged out successfully"
     }
     ```

### Improvements
There are several areas where the project can be further improved:
1. **Still a lot of refactoring can be done**
**Redundancy Reduction**: For example the JwtPayload interface can be consolidated.
**Typescript types**: At some places, due to time constraint, <any> is used, It can be replaced.
**Environment variables**: These can be used for values like Jwt secret
**SharedModule**: To avoid the dependency hell and maintainability, this can be used
**Logout implementation**: The logout implementation is minimal because of the usage of jwt, more robust approaches can be used like refresh token.
**Constants/Enums use**: Still there are places, which can be replaced with the constants.
**Consistent/Global Error Handling**: Nest Custom Exceptions alognwith the Global filters to handle exception of entire Application
**Improved Response Models**: Data Structures should be used for different areas, eg; the Success and Error Response. 
2. **Testing**: For now some basic unit tests are written for demonstration, integration tests can be added.
3. **Swagger**: API documentation is missing, can be added
4. **Error Monitoring and Logging**: Winston or Sentry like tools can be used for proper error logging and monitoring which are very useful in the production envrionment.
5. **Containerization**: Containerization can be added to be used later on for CI/CD.
6. **Package vulnerability detection**: Packages like Snyk can be used
7. **Rate limiting**: To avoid brute-force attacks.
8. **Security**: Can be improved using security headers against common web vulnerabilities using package like helmet. Eg; CSP, XSS Protection etc