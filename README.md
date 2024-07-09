# Project Platform

## Table of contents

- [Introductions](#introductions)
- [Documentation](#documentation)
- [Structure of Project](#structure-of-project)
- [Additional Information](#additional-information)
- [FAQ](#faq)

## Introductions

Can I create a robust application project that utilizes Node (Backend), Vue (Front-end), PostgreSQL (Database) and GraphQL (Database).

It wasn't the project's original purpose but given that I, with advice from others, built this project I believe this work should help others.

## Documentation

Read the [documentation](docs/index.md) on how this project was created.

Documentation pertaining to how to start up each aspect of the project, the _backend_, the _front-end_ and the _database_, can be found within a README file. Each aspect has a project has a `README.md` file 

## Structure of Project

The project, at this time, is comprised of 3 main folders. The front-end, built using Vue, is inside the `/frontend-vue` folder. The backend, built using Prisma and Node, is inside the `/backend-node-postgresql` folder. Lastly, the postgresql database, built using docker and docker compose, is inside the `/postgresql` folder.

Each of these folders must be opened in their own terminal and run to have the project working correctly. The Backend relies on the database to run, and the front-end relies on the backend to work.\
Run the database first, then the backend and finally the front-end.

When the page is running you'll see a page like this, when you go to `http://localhost:5173/`

![Screenshot of the Login Page](/public/login-screenshot.jpg)
_Screenshot of the Login Page_

<!-- TODO: add screenshot of register page -->

## Additional Information

A list of task needed to be developed can be found here [TODO List](docs/todo.md).

## FAQ

**Q: Who is this project for**

**A:** Anyone looking for a project template, that uses node (backend) and vue (front-end). Anyone who wants a quick guide on how to build a server and a front-end, that communicate with one another. Lastly, me. I want to see how I can improving things.

**Q: What can people do with the project**

**A:** Under no circumstance is someone allowed to use this project to copy and paste their way through a test. Preferably, don't use this as a quick for profit.\
By all means, use the url links throughout the project. If you are going to use the code created here please add to it, make it yours. 
