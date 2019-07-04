# Welcome to Auto Mart

Auto Mart is an online marketplace for automobiles of diverse makes, model or body type. With Auto Mart, users can sell their cars or buy from trusted dealerships or private sellers.

[![Build Status](https://travis-ci.com/mthamayor/auto-mart.svg?branch=develop)](https://travis-ci.com/mthamayor/auto-mart)
[![Coverage Status](https://coveralls.io/repos/github/mthamayor/auto-mart/badge.svg?branch=develop)](https://coveralls.io/github/mthamayor/auto-mart?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/04d1eaa5d8ff1c063be6/maintainability)](https://codeclimate.com/github/mthamayor/auto-mart/maintainability)

## Getting started

 1. Documentation, Pivotal tracker project and UI
 2. Clone the repository
 3. Install dependencies from the root directory
 4. Starting the project from a localhost server
 5. ENV Variables
 6. Deployment (API and UI)

## Documentation, Pivotal tracker project and UI

This Documentation for this API can be found on [here](https://mthamayor-auto-mart.herokuapp.com/api/v1/docs)

This Pivotal tracker project for this API can be found on [here](https://www.pivotaltracker.com/n/projects/2346094)

This Root branch for the User Interface is [gh-pages](https://github.com/mthamayor/auto-mart/tree/gh-pages)

## Cloning the repository

Open the git bash terminal in your preferred directory and run

    git clone https://github.com/mthamayor/auto-mart.git

## Install dependencies from the root directory

Open a Command Line Interface
Install the root directory dependencies with

    npm install

## Starting the project from a localhost server

From the project's root directory, you can start both the server and client concurrently with

    npm run dev
You can choose to run tests with

    npm run test

## ENV Variables

A sample of the env file is provided. Some features will not work in productions unless they are
filled out.

## Deployment (API and UI)

This Application API is deployed on heroku via [https://mthamayor-auto-mart.herokuapp.com/](https://mthamayor-auto-mart.herokuapp.com/)

The frontend (UI) is deployed on github pages via [https://mthamayor.github.io/auto-mart/](https://mthamayor.github.io/auto-mart/)
For admin privileges, please log in with the below credentials

| Admin accounts          | Password        |
| :---------------------: |:---------------:|
| admin@automart.com      | userpassword123 |

If you do not wish to create an account,  please log in with the below credentials

| User accounts     | Password        |
|:-----------------:|:---------------:|
| user@automart.com | userpassword123 |
