 services/ (Business Logic Layer)
The services layer is responsible for handling business logic, interacting with the database, and processing data before sending it to controllers.
It helps keep controllers clean and focused on handling HTTP requests/responses.
Services are reusable across different parts of your app (e.g., controllers, jobs, event handlers).
📄 authService.js (Handles Authentication & Authorization)
Why?

Manages user authentication (login, signup, logout).
Handles JWT token creation & verification.
Encrypts passwords before saving to the database.
Ensures users have the right permissions.