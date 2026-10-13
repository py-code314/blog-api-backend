# The Odin Project: Blog API (Backend)

This is a solution for the [Blog API Project](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api) as part of The Odin Project curriculum.

## Table of contents

- [The Odin Project: Blog API (Backend)](#the-odin-project-blog-api-backend)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [🚀 Features](#-features)
    - [1. Authentication \& Session Handling:](#1-authentication--session-handling)
    - [2. Post \& Comment Management:](#2-post--comment-management)
    - [3. Role Based Access Control:](#3-role-based-access-control)
    - [4. Database ORM \& Migrations:](#4-database-orm--migrations)
    - [5. Input Validation \& Error Handling:](#5-input-validation--error-handling)
  - [Links](#links)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📋 Pre-Requisites](#-pre-requisites)
  - [⚙️ Getting Started](#️-getting-started)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Environment Setup](#2-environment-setup)
    - [3. Database Setup](#3-database-setup)
    - [4. Prisma Migrations:](#4-prisma-migrations)
    - [5. Start the Server:](#5-start-the-server)
  - [📂 Project Structure](#-project-structure)

## Overview

This is a backend project for creating and reading blog posts by authors and readers. It consists of RESTful APIs built with Node.js/Express and serves as a headless backend for two distinct frontend applications (Author Portal & Reader Client). The backend uses Prisma ORM to model relational data and interact with the database efficiently.


## 🚀 Features

### 1. Authentication & Session Handling:
      
      - `passport-local` for authenticating login by email & password.
      - `passport-jwt` for authenticating subsequent requests by validating JWT.
      - Login sessions are handled via JWT with an expiration time of 1 day.

### 2. Post & Comment Management:

      - Full CRUD (Create, Read, Update, Delete) operations for blog posts reserved for authors.
      - Status management for posts (e.g., Published Posts vs Drafts)
      - Read-only access for published posts for readers.
      - Commenting option on posts which is limited to users logged in.
      

### 3. Role Based Access Control:

      - Route protection ensuring reader accounts can't edit or delete posts.


### 4. Database ORM & Migrations:

     - Schema modeling and migrations are managed by Prisma.
     - Relational data mapping between Users, Posts, and Comments


### 5. Input Validation & Error Handling:

      - Request validation using `express-validator` for all inputs.
      - Centralized Express error middleware for catching and handling API failures gracefully.



## Links

- [Solution URL](https://github.com/py-code314/blog-api-backend)



## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & ORM:** PostgreSQL & Prisma
- **Authentication:** Passport.js & JWT (JSON Web Tokens)
- **Security:** Bcrypt (for password hashing)


## 📋 Pre-Requisites

Before you begin, make sure you have the following tools installed on your machine:

- **Node.js** [Installation instructions](https://www.theodinproject.com/lessons/foundations-installing-node-js)
- **npm** (Installing Node also installs npm alongside it.)
- **PostgreSQL** [Installation instructions] (https://www.theodinproject.com/lessons/nodejs-installing-postgresql#assignment)
- **Git** [Installation & Setup] (https://www.theodinproject.com/lessons/foundations-setting-up-git)


## ⚙️ Getting Started


### 1. Clone the Repository

      - Run `git clone https://github.com/py-code314/blog-api-backend` to clone the repository.
      - Run `cd blog-api-backend` to navigate to the project directory.
      - Run `npm install` to install dependencies.
   

### 2. Environment Setup

      - Create `.env` file in root directory
      - Configure the required environment variables based on the `.env.sample` file.


### 3. Database Setup

      - Enter the PostgreSQL shell by running `psql` in your terminal.
      - Create a new db by running `CREATE DATABASE blog_api;`
      - Run `\l` to check if the db was created.
      - Exit the shell by using `\q` + Enter.


### 4. Prisma Migrations:

      - Run `npx prisma migrate dev` to create tables in database based on the schema.
      - Run `npx prisma generate` to generate the Prisma Client.


### 5. Start the Server:

      - Run the application in development mode by running the command `npm start`.



## 📂 Project Structure


```
├── config/                  # Config files for Passport
├── controllers/            # Controller functions for the routes
├── errors/                 # Custom errors
├── generated/
│── lib/                    # Prisma setup          
├── middleware/             # Files for authentication and error handling
├── prisma/                 # Prisma schema and migration files
├── routes/                 # API endpoints for various routes
├── utils/                  # Helper functions to use in controllers               
├── .babelrc/               
├── .env                          
├── .env.sample                   
├── .gitignore                     
├── .prettierrc                   
├── app.js                  # Main entry point
├── eslint.config.js
├── package-lock.json
├── package.json
├── prisma.config.js
└── README.md
``` 

