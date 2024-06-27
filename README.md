# Project Platform

## Table of contents

- [Introductions](#introductions)
- [Documentation](#documentation)
- [Structure of Project](#structure-of-project)

## Introductions

Can I create a robust application project that utilizes Node (Backend), Vue (Front-end), PostgreSQL (Database) and GraphQL (Database).

<!-- What is the purpose of this project? -->
<!-- What does the project do? -->
<!-- Where is the docs? -->
<!-- ? -->

## Documentation

Read the [documentation](docs/index.md) on how this project was created.

## Structure of Project

The project, at this time, is comprised of 3 main folders. The front-end, built using Vue, is inside the `/frontend-vue` folder. The backend, built using Prisma and Node, is inside the `/backend-node-postgresql` folder. Lastly, the postgresql database, built using docker and docker compose, is inside the `/postgresql` folder.

Each of these folders must be opened in their own terminal and run to have the project working correctly. The Backend relies on the database to run, and the front-end relies on the backend to work.\
Run the database first, then the backend and finally the front-end.

When the page is running you'll see a page like this, when you go to `http://localhost:5173/`

![Screenshot of the Login Page](/public/login-screenshot.jpg)
_Screenshot of the Login Page_


