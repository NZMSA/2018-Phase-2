# Phase 2 Training 2018

## Overview

We will be creating a basic facial recognition authentication using Microsoft Azure custom vision service. This is to demonstrate how you can integrate and utilize Microsoft cognitive services in many unique ways.

![customVisionModelChart](images/customVisionModelChart.PNG)

### To do this session.
1. Create a new feature branch for authentication feature development on GitHub repository.
2. Set up custom vision project.
3. Add a camera inegration.
4. Integrate custom vision model 


## 1. Creating a new development branch.
Your master branch should be a production ready, bug free, and thoroughly tested, therefore we are going to be developing this feature on a seperate development branch.

In your repository, launch powershell or cmd.

```
$git status
#On branch master
$git checkout -b feature/authentication
$git status
#On branch feature/authentication
```
This creates a new branch locally and switch to it. 

Now we are ready for development. :)

## 2. Setup custom vision project.

Navigate to: https://www.customvision.ai/ and sign in with your account.

Enter a project name and description -> Create project.

![customVisionModelChart](images/2.1.PNG)

We will revisit this soon.

## 3. Add camera integration
In this tutorial we will be integrating a camera into our react app using **react-webcam** package available on npm.

Reference: https://www.npmjs.com/package/react-webcam

1. In your repository, PowerShell or cmd

```
npm install react-webcam
```

