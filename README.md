# Introduction
*By Jonathan BOUTAKHOT, Quynh-Nhien PHAN, Océane SALMERON (ING4, GP03)*

#### Project

This is the nodejs project for the **Web Technology** AND the **DevOps** course at ECE Paris-Lyon, ING4.

## Docker-compose

It is possible to run the server on a docker container with docker-compose:

`docker-compose up`

This command line will use the *docker-compose.yml* file to build the docker image from the *Dockerfile*, setup the server and run the app inside a container. 

The following actions will be performed: 
- install dependencies
- populate the database
- run the server

Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

## Installation

##### Install the dependencies

`npm install`

## Populate the database

To populate the database, run 

` npm run populate`

### Dummy data

This script will create dummy data with users and metrics for those users.

**Demo users:** 
- `username: jane` `password: janedd`
- `username: jack`  `password: jacky`

## Run the server
 
#### Run the app in dev mode (with nodemon)
 
`npm run dev`

The page will reload if you make edits.<br>

#### Run the app
 
`npm run start`

Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

## Build the app

To build the app and convert .ts files into .js files, run

`npm run build`

The .js files will be created in the */dist* folder.

## Run tests

To run tests, use 
`npm run test`

*LevelDB with nodejs prevents from doing unit testing properly because of lockers which block concurrent acces to the DB. The DB cannot be cleaned between each tests and the solution would be to create a seperate db folder for each test.*

## API
### Base URL

`http://localhost:8081`

### Users

#### Endpoints

- `POST /users `
- `GET /users `
- `GET /users/:id `
- `UPDATE /users/:id `
    - *the right user needs to be authenticated*
- `DELETE /users/:id `
    - *the right user needs to be authenticated*

### Metrics

#### Endpoints

*The right user needs to be authenticated*

- `POST /users/:userID/metrics `
- `GET /users/:userID/metrics `
- `GET /users/:userID/metrics/:metricID `
- `UPDATE /users/:userID/metrics/:metricID `
- `DELETE /users/:userID/metrics/:metricID `

### Auth

#### Endpoints

- `POST /login`
- `GET /logout`