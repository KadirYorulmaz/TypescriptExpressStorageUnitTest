# Webdevelopment - Devops project
 
## Introduction 
This project is about basic CRUD functionalities
CRUD functionalities for a User 
CRUD functionalities for a Metrics which consist of timestamp and value

The project is for help to other new beginners.
The project is using technologies like 
- NodeJs
- Typescript
- EJS
- JQuery (Ajax)
- LevelDB
- Express


## Installation
downloads the packages that are in package.json and creates the folder node_modules
```bash
npm install
```

## Usage
Writing the below will start your server  
```bash
npm start
```
Writing the below will watch your servers
```bash
npm run dev
```
Writting the below will start the test
```bash
npm test
```

The server will then run on port 8080
Paste below link to the browser will give you the ability to acces the website
http://localhost:8080/login



## preadded users and metrics 
There are two preadded users


| Tables | username      | password     |
| -------|:-------------:| ------------:|
| 1      | sergei        | sergei       |
| 2      | gregor        | gregor       |


## Travis
We have added contineous integration (CI) by travis.
And fortunately all our tests passed. 
The tests consist of 
- User (CRUD) 
- Metrics (CRUD) 

Here is the url for travis 
https://travis-ci.org/KadirYorulmaz/TypescriptExpressStorageUnitTest


## IF PROJECT DOES NOT WORK AFTER GIT CLONE
Please delete the following 
- node_modules
- db
- dist

and afterwards you need to run the following commands
```bash
npm install
```

```bash
npm start
```

#LICENSE
License: MIT

# Made by Abdul Kadir Yorulmaz & Adit Gupta