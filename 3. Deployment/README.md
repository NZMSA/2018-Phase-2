# Phase 2 Training 2018

# Table of Contents
1. [Deployment](#deployment)
2. [App Insights](#appinsights)

## Deployment
<br>

We will be deploying the app through Azure Pipeline and construct a build, and release pipeline.

Before you start, there are some prerequisites for this section listed below. 
1. You must have your source code on GitHub
2. You must have an Azure account.
3. Create an Azure DevOps account.

As soon as those two requirements are met, we can get started.

### Setup
The first thing I will ask you to do is to create an azure web application. It can be any blank web application created on any server. Once you have created the server I will ask you to now go to application settings and set the Node JS version to the one that I have specified in this image.

![Change the node version in Application Settings](https://i.gyazo.com/9f6647c201d937b751b7573b438c2cc5.png "Change the node version in Application Settings")

Now, we're going to leave this alone for a bit and get back to it later. I now want you to go to your GitHub and create a new file called 
``` 
azure-pipelines.yml
```

You can either do this locally and then push it, or do it on your Github itself. I'm going to do it on the Github website because it's easier. 

Now i'm going to enter the code below into the file and commit it.

```
# Node.js with React
# Build a Node.js project that uses React.
# Add steps that analyze code, save build artifacts, deploy, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/javascript

pool:
  vmImage: 'Ubuntu 16.04'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '8.x'
  displayName: 'Install Node.js'
    
- script: |
    npm install
    npm run build
  displayName: 'npm install and build'
  
- task: ArchiveFiles@2
  inputs:
    rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
    archiveFile: '$(System.DefaultWorkingDirectory)/build.zip' 


- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: '$(System.DefaultWorkingDirectory)/build.zip' 
    artifactName: 'build' 

```

What this will do is tell Azure Pipelines to first install NodeJs, then install the dependencies via NPM and then transpile the Typescript files into JavaScript via npm run build.

Great, after this we can get started on Azure DevOps.

### Azure Devops

Firstly, let's connect our GitHub accounts to Azure DevOps. go to the "Repos" section on the left and connect your GitHub Account. It should be a simple process.
<br>

Following this, go to the "Pipelines" menu next. Now what we will be doing is creating a build pipeline. Follow the instructions on the screen and you will easily be able to start building your code on Azure Pipeline. 

The process behind it is quite simple, when you construct a build pipeline and link it to your GitHub the pipeline checks every time a commit has been made to your GitHub and starts building the code. It looks at the YML file (Called YAML) as described previously and it executes the commands top to bottom. As mentioned previously we wanted the pipeline to install NodeJS, and then install the dependencies and run the build.

<br>
Once that is completed, we then get to the "PublishBuildArtifacts". What this does is that it "publishes" all of the built files to the azure pipeline so that you can use those built files and deploy them when you want to release.

#### Release

Prerequisites.
- For this part, you must have first successfully completed a build from Azure Pipeline.

Now, let's go  to the "Releases" part of the pipelines and what we want to do is construct a new release.


Where it says "Add an artifact" you want to add the latest build that your build pipeline has completed. Select your latest build and leave the rest of the settings default, unless you know what you are doing.
![Artifact] (https://i.gyazo.com/5057dd240067975068f68c40638c4a96.png "select an artifact")

<br>
Next, you want to select a template. Select the first template shown on the right hand side called Deploy Azure App Service.
![Deployment](https://i.gyazo.com/d59071873ad5088f552f54c260b6fa7e.png "Select the first template on the right: Azure App Service Deployment" )

You will see an exclamation mark next to "1 job, 1 task" click on it. Now, you need to select your Azure Subscription and authorize it. Next you want to select the app service that you created previously on your app service name. 

<br>

After this, you then need to click on the "Deploy Azure App Service" button, as shown in this photo and ensure that you see the same screen.

![AzureAppService](https://i.gyazo.com/8e57bff68be842d4e2ab17565758706d.png "azure")

Leave the package slot as it is, we will not be changing that.
```
$(System.DefaultWorkingDirectory/**/*.zip)
```


Now, save the contents of this and go back to your "Pipelines" and click "Deploy". After it has finished building, we need to go back to Azure.

#### Post Build
Go back to "Application Settings" as shown previously, and scroll all the way down to "Virtual Path". There should be a field called  "Physical Path". Change the physical path to this string.

```
site\wwwroot\build
```

Your website should be up and running now! If the images are not displaying, then you need to replace https to just http in your URL and it should be working.

## App Insights <a name="appinsights"></a>
