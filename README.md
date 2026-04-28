# Recipe API Server

RESTful API for recipes using Express + MongoDB Atlas + JWT + Joi.

## Features
- Authentication with `JWT` (`register` and `login`)
- Role-based authorization (`admin`, `user`, `guest`)
- Users management (list users, update password, delete user)
- Recipes CRUD with:
  - public/private visibility
  - free-text search
  - pagination
  - filter by preparation time
- Categories are updated automatically through recipe create/update/delete
- Centralized error format: `{ "error": { "message": "..." } }`

## Project Structure
- `config/` - environment and DB connection
- `controllers/` - request handlers
- `middlewares/` - auth/validation/error middlewares
- `models/` - mongoose models
- `routes/` - REST endpoints
- `services/` - category sync logic
- `validations/` - Joi schemas

## Environment Variables
Copy `.env.example` to `.env` and fill values:
- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Run
```bash
npm install
npm run dev
```

## API Documentation
<table>
  <thead>
    <tr>
      <th>Resource</th>
      <th>Method</th>
      <th>URL</th>
      <th>Auth</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Auth</td><td>POST</td><td>/auth/register</td><td>Public</td><td>Register new user</td></tr>
    <tr><td>Auth</td><td>POST</td><td>/auth/login</td><td>Public</td><td>Login and receive JWT token</td></tr>
    <tr><td>Users</td><td>GET</td><td>/users</td><td>Admin</td><td>Get all users</td></tr>
    <tr><td>Users</td><td>PATCH</td><td>/users/:id/password</td><td>Self or Admin</td><td>Update user password</td></tr>
    <tr><td>Users</td><td>DELETE</td><td>/users/:id</td><td>Admin</td><td>Delete user and their recipes</td></tr>
    <tr><td>Recipes</td><td>GET</td><td>/recipes?search=&amp;limit=&amp;page=</td><td>Optional</td><td>List recipes with pagination and search</td></tr>
    <tr><td>Recipes</td><td>GET</td><td>/recipes/:id</td><td>Optional</td><td>Get recipe by id (with visibility rules)</td></tr>
    <tr><td>Recipes</td><td>GET</td><td>/recipes/by-prep-time/:minutes</td><td>Optional</td><td>Get recipes up to max prep time</td></tr>
    <tr><td>Recipes</td><td>POST</td><td>/recipes</td><td>User/Admin</td><td>Create recipe</td></tr>
    <tr><td>Recipes</td><td>PUT</td><td>/recipes/:id</td><td>Owner/Admin</td><td>Update recipe</td></tr>
    <tr><td>Recipes</td><td>DELETE</td><td>/recipes/:id</td><td>Owner/Admin</td><td>Delete recipe</td></tr>
    <tr><td>Categories</td><td>GET</td><td>/categories</td><td>Public</td><td>Get all categories</td></tr>
    <tr><td>Categories</td><td>GET</td><td>/categories/with-recipes</td><td>Optional</td><td>Get all categories with visible recipes</td></tr>
    <tr><td>Categories</td><td>GET</td><td>/categories/:codeOrName</td><td>Optional</td><td>Get one category with visible recipes</td></tr>
  </tbody>
</table>

## Notes
- For Mongo Atlas in development, allow access from all IPs (`0.0.0.0/0`) as required.
- A Postman collection is included at `docs/Recipe-API.postman_collection.json`.
