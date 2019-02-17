# Setting MTG-Cube up on your development machine

This document describes how to set up the Application for local development.

## Prerequisite Software
- A [Git](https://git-scm.com/) source control client to create a local working copy of the project.
- The [Node.js](https://nodejs.org/en/) javascript runtime engine to execute build and test scripts.
- The [npm.js](https://www.npmjs.com/) package management tool to install dependencies.

## Getting the Source Code
Fork and clone the `MTG-Cube` repository:
1. Login to your GitHub account or create one by following the instructions given [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [MTG-Cube repository](https://github.com/Pilopa/mtg-cube).
3. Clone your fork of the repository and define an `upstream` remote pointing back to the [original repository](https://github.com/Pilopa/mtg-cube) that you forked from.

```
# Clone your GitHub repository:
git clone git@github.com:<github username>/mtg-cube.git

# Go to the MTG-Cube directory:
cd mtg-cube

# Add the main MTG-Cube repository as an upstream remote to your repository:
git remote add upstream https://github.com/Pilopa/mtg-cube.git
```

## Installing Dependencies
Next, install the JavaScript modules needed to build and test MTG-Cube:
```
# Install MTG-Cube project dependencies (package.json)
npm install
```

## Creating the Card Database
MTG-Cube utilises a tool to create its card database. 

Follow the instructions in `/tools/database-generation/README.md` to create the database and insert it into your work environment.

## Testing the Application
To run the application locally, run the following code inside the root application folder:

```
ng serve
```

This will start the application in watch-mode, meaning that it will automatically recompile and reload the application every time you perform changes to the source code.

The forked version currently shares its database and authentication with the official [Development Environment](https://mtg-cube-dev.firebaseapp.com).

## Commit Message Guidelines
MTG-Cube uses the [Conventional Commits](https://www.conventionalcommits.org) standard for commit messages to determine version numbers and generate changelogs. Please refer to the linked documentation and follow the guidelines.
