# Introduction
*By Jonathan BOUTAKHOT, Quynh-Nhien PHAN, Océane SALMERON (ING4, GP03)*

#### Project

This is the nodejs project for the Web Technology course at ECE Paris-Lyon, ING4.

## Installation

##### Install the dependencies

`npm install`

## Populate the database

To populate the database, run 

` tsc && ./node_modules/.bin/ts-node bin/populate.ts`

## Run the server
 
#### Run the app in dev mode (with nodemon)
 
`npm run dev`

The page will reload if you make edits.<br>

#### Run the app
 
`npm run start`

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Build the app

To build the app and convert .ts files into .js files, run

`npm run build`

The .js files will be created in the */dist* folder.

## Run tests

To run unit tests, use 
`npm run test`

## API
### Base URL

`https://localhost:8081`

### Users

#### Endpoints

- `POST /users `
- `GET /users `
- `GET /users/:id `
- `DELETE /users/:id `

### Metrics

#### Endpoints

- `POST /users/:userID/metrics `
- `GET /users/:userID/metrics `
- `GET /users/:userID/metrics/:metricID `
- `DELETE /users/:userID/metrics/:metricID `