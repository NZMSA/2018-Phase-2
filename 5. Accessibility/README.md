# Accessibility | Advanced Features

Accessibility is the practice of making your websites usable by as many people as possibility. This will usuallty invovle thinking outside the box in terms of input to your computer. 

For the scope of your assessment this most likely will invovle audio or video. Examples may include but are not limited to...
* Reading out loud text or images
* Face recognition
* Speech to text

This module will focus on integrating audio for search (speech to text). The goal is for a user to be able to say the tag that they are searching for and have what they say automatically appear in the search box.


#### Creating some UI
We will need to add some sort of UI to get user input, the obvious choice in this example a micrphone button.

Inside our `MemeList.tsx` where we have oue MemeList Component include a simple button

```
<div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>
```

and insert this into your `index.html`
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
```

Notice how we are assuming we will be make a fubction called `searchTagByVoice()`

## Media Stream Recorder
We will be using Media Stream Recorder in particialar the npm package `msr` so inside your project run.
```
npm i msr --save
```

Follow this link for reference https://www.npmjs.com/package/msr

and include 
```
import MediaStreamRecorder from 'msr';
```
 at the top of your `.tsx` file.


Next we will create a new function called `searchTagByVoice()`. Looking at the documentation for MediaStreamRecorder.js we see that `getUserMedia()`.

Please note that `getUserMedia()` can only be called from an `https` url, `localhost` or `file://` url.

The next step is to choose the form of media. Since we're only wanting speech from the user we can specify the media constraint as only being audio.

```
    const mediaConstraints = {
            audio: true
    };
```
Next we can use the provided function and modify it slightly.

```
    const mediaConstraints = {
        audio: true
    }
    const onMediaSuccess = (stream: any) => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
        mediaRecorder.ondataavailable = (blob: any) => {
            // this.postAudio(blob);
            mediaRecorder.stop()
        }
        mediaRecorder.start(3000);
    }

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    function onMediaError(e: any) {
        console.error('media error', e);
    }

```

## Cognitive Services
We will be using Cognitive Services to help convert our speech input to text (Speech to Text). (Please make a free account or sign in with your exisitng one)

https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/

The API keys last 30 days so don't worry about needing to refresh them.

The API requires an `access token`. If you require more guidance please follow this link for more information.

https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-apis


#### Getting Access Token

It is recommended that you test on postman before trying to write any code.

Next, we will need to write some code to get our `access token`.

```
    let accessToken: any;
    fetch('[ISSUE TOKEN END POINT]', {
        headers: {
            'Content-Length': '0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': '[YOUR SUBSCRIPTION KEY]'
        },
        method: 'POST'
    }).then((response) => {
        // console.log(response.text())
        return response.text()
    }).then((response) => {
        console.log(response)
        accessToken = response
    }).catch((error) => {
        console.log("Error", error)
    });
```

If it works we should get something like this....
```
eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1cm46bXMuY29nbml0aXZlc2VydmljZXMiLCJleHAiOiIxNTQyNDg3ODI4IiwicmVnaW9uIjoid2VzdHVzIiwic3Vic2NyaXB0aW9uLWlkIjoiOWNjYjI2NGFmYjJlNDkzNjhmZDRiNTIzNGY1ZTFlYTUiLCJwcm9kdWN0LWlkIjoiU3BlZWNoU2VydmljZXMuRnJlZSIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIiLCJzY29wZSI6InNwZWVjaHNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLnNwZWVjaHNlcnZpY2VzLndlc3R1cyJ9.J088EkYXUHgW3EH7shOFTWUuMWKcS-W17LC3NH6kWDse
```

#### Making Post Request

If we look at our documentation we need to parse the `access token` through when we use our `POST` method.

In our actual `POST` method we can do essentially the same thing but change some parameters.

```
    // posting audio
    fetch('[YOUR API END POINT]', {
        body: blob, // this is a .wav audio file    
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + accessToken,
            'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
            'Ocp-Apim-Subscription-Key': '[YOUR SUBSCRIPTION KEY]'
        },    
        method: 'POST'
    }).then((res) => {
        return res.json()
    }).then((res: any) => {
        console.log(res)
    }).catch((error) => {
        console.log("Error", error)
    });

```

Notice how we are parsing in our access token under headers and authorization
```
'Authorization': 'Bearer' + [ACCESSTOKEN]
```

If this all works we will get a response that looks something like this.
```
{RecognitionStatus: "Success", DisplayText: "SpongeBob for Life", Offset: 5800000, Duration: 20700000}
```

#### Updating our UI
For MemeBank we will simple set the search box value to `DisplayText` and if we notice in our response we get an extra `.` at the end, so we remove it.


```
const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
textBox.value = (res.DisplayText as string).slice(0, -1)
```

#### Done

This will be removed in 2 days so copy and paste this

Key 1: ac4a5739b2fa4d749b080822e01c167a

Key 2: b93f4ea4fc954fe1a609e88d4fc07ac2

