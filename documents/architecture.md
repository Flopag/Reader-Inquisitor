# Architecture

## Components

- Frontend: contains the webclient
  - Do not have access to database
- Backend: contains the API and manipulate user data
- Database: contains all data of the app
- Bot: contains all discord bot logic
  - Do not have access to database
- Worker: contains all routines (background task)