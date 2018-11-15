# Creating my meme bank front end

Note: Just a heads up, this guide may not be extensive. Everything will be covered in the in person workshop, of which items may be missed in here. 

### Contents :bookmark_tabs:
1. Before you start
2. Starter project overview
3. Retrieve all memes and search by tag (GET)
4. Add New Meme (POST)
5. Edit existing meme (PUT)
6. Delete existing meme (DELETE)


## 1. Before you start :bulb:

Before you start coding away, take a moment to have a look through this section of the repo. You'll notice that there are two folders - 'Starter Project' and 'Completed Project'. If you want to see what the final output will look like or have any issues following this documentation, go ahead and `npm install` then `npm start` inside that folder. 

In the starter code, the structure, styling and basic functions have all been provided (otherwise this document would be massive!). Since you should all be familiar with React js, we'll be focusing on consuming the API for all of the CRUD (Create, Read, Update, Delete) operations. Specifically, they are:
- CREATE: Uploading a meme (POST)
- READ: Retrieving all memes and searching by tag (GET)
- UPDATE: Updating meme title and/or tag (PUT)
- DELETE: Deleting a meme (DELETE)

Before you proceed, make sure you download / clone the starter project and `npm install` (this might take some time). We'll be building on this project!

## 2. Starter project overview :eyeglasses:

In this project, you'll want to take a look at these files
- `App.tsx` - this is the main component class and renders the header, and two components `MemeDetail` and `MemeList`.
- `MemeDetail.tsx` - this component renders information relating to a specific meme (meme image, title etc).
- `MemeList.tsx` - this component renders the list of memes as a table.
- `index.css` - main stylesheet.


## 3. Retrieve all memes and search by tag (GET) :inbox_tray:
To retrieve all memes, we're going to use this endpoint : `http://phase2apitest.azurewebsites.net/api/meme` which returns a JSON in this format: 

```json
[
    {
        "id": 2,
        "title": " I have no idea what im doing dog",
        "url": "https://phase2blob.blob.core.windows.net/images/364e6887-0f54-4c96-9b17-ee66151795ca.jpg",
        "tags": "Animal",
        "uploaded": "10/23/2018 12:38:06 PM",
        "width": "680",
        "height": "383"
    },
    {
        "id": 4,
        "title": "Copyright University of Auckland...",
        "url": "https://phase2blob.blob.core.windows.net/images/535052b4-4fee-42a3-8387-83f6851d2047.jpg",
        "tags": "University",
        "uploaded": "11/3/2018 3:31:34 AM",
        "width": "296",
        "height": "284"
    }
]
```

We can also append query parameters such as `tag?='spongebob'` if we want to get all memes with the tag 'spongebob'

:page_with_curl: 1. To fetch memes, add this function to `App.tsx` (just below `selectNewMeme(...)`)

```javascript
private fetchMemes(tag: any) {
    let url = "http://phase2apitest.azurewebsites.net/api/meme"
    if (tag !== "") {
        url += "/tag?=" + tag
    }
    fetch(url, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
        let currentMeme = json[0]
        if (currentMeme === undefined) {
            currentMeme = {"id":0, "title":"No memes (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
        }
        this.setState({
            currentMeme,
            memes: json
        })
    });
}
```
- We first checks if there are any tags specified in the parameter and appends it to the url. 
- Then make the GET request and convert it into JSON format. 
- If the json is undefined (i.e. empty or invalid), we set the current meme with a default value.
-  Finally, we set the state of `currentMeme` as the first item and `memes` as the full meme list.

Now, we simply need to bind the method to self and call it in the constructor.

:page_with_curl: 2. Inside the constructor method in `App.tsx`, add the following
```javascript
this.fetchMemes = this.fetchMemes.bind(this)
this.fetchMemes("")	
```
Now if you run the app, you should see all the memes -  try clicking on the meme items on the right to see the images! (If you don't see any memes and there's no error, someone might have deleted all the memes from the bank....)

To search by tag, we need to pass `fetchMeme(...)` as a prop to the `MemeList.tsx` component.

:page_with_curl: 3. In `App.tsx`, find this snippet 
```javascript
<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.methodNotImplemented}/>
```

and change it so it looks like this

```javascript
<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes}/>
```

Run it and now you should be able to search by tag! 

On a high level, we're passing `fetchMemes` as a callback into the `MemeList` component. When the user presses 'Search', we get the textbox value and call `fetchMeme` with the tag value.

## 4. Add New Meme (POST) :mailbox_with_mail:

If you press 'Add Meme' button on the top right corner, you'll see that a modal appears with input boxes for title, tag and image. Using these 3 inputs, we're going to make a POST request using the following endpoint: `http://phase2apitest.azurewebsites.net/api/meme/upload`.

This endpoint takes in `Title`, `Tags` and `image` form data key value pair in the body. 

Before we can make the POST request, we need to get the image file. 

:page_with_curl: 1. Add this function to `App.tsx` (below `fetchMemes`)
```javascript
private handleFileUpload(fileList: any) {
    this.setState({
        uploadFileList: fileList.target.files
    })
}
```
:page_with_curl: 2. Now we need to call this method. Find this snippet
```javascript
<input type="file" onChange={this.methodNotImplemented} className="form-control-file" id="meme-image-input" />
```
and change it so it looks like this:
```javascript
<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
```

:page_with_curl: 3. Bind `uploadFileList` to self by adding the following inside the constructor of `App.tsx`
```javascript
this.handleFileUpload = this.handleFileUpload.bind(this)
```

When we choose an image, we now set it as the state of `uploadFileList`. Now we're ready to make the POST request!

:page_with_curl: 4. Add this function to `App.tsx` (below `handleFileUpload`)
```javascript
private uploadMeme() {
    const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
    const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
    const imageFile = this.state.uploadFileList[0]

    if (titleInput === null || tagInput === null || imageFile === null) {
        return;
    }

    const title = titleInput.value
    const tag = tagInput.value
    const url = "http://phase2apitest.azurewebsites.net/api/meme/upload"

    const formData = new FormData()
    formData.append("Title", title)
    formData.append("Tags", tag)
    formData.append("image", imageFile)

    fetch(url, {
        body: formData,
        headers: {'cache-control': 'no-cache'},
        method: 'POST'
    })
    .then((response : any) => {
        if (!response.ok) {
            // Error State
            alert(response.statusText)
        } else {
            location.reload()
        }
    })
}
``` 

We get the value of the 3 input fields and make a POST request. If there is an error, we show that as an alert. Otherwise we reload the page.

:page_with_curl: 5. Bind `uploadMeme` to self by adding this to the constructor of `App.tsx`
```javascript
this.uploadMeme = this.uploadMeme.bind(this)

```

:page_with_curl: 6. Call `uploadMeme` when the 'upload' button is pressed by changing this
```javascript
<button type="button" className="btn" onClick={this.methodNotImplemented}>Upload</button>
```
to this
```javascript
<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
```

:page_with_curl: 7. Now that we're not using the `methodNotImplemented` function, go ahead and delete it (lint will complain if we keep it there).

That's it for POST request - Try uploading a meme!

## 5. Edit existing meme (PUT) :pencil:

We're now going to try edit the title and/or the tag of an existing meme using the following endpoint: `http://phase2apitest.azurewebsites.net/api/meme/[id]` where id is the id of the meme you want to edit. Unlike previous requests, we need to pass in all values relating to that specific meme such as uploaded date, url, width and height. 

:page_with_curl: 1. In `MemeDetail.tsx` add the following (below `downloadMeme`)
```javascript
private updateMeme(){
    const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement
    const tagInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement

    if (titleInput === null || tagInput === null) {
        return;
    }

    const currentMeme = this.props.currentMeme
    const url = "http://phase2apitest.azurewebsites.net/api/meme/" + currentMeme.id
    const updatedTitle = titleInput.value
    const updatedTag = tagInput.value
    fetch(url, {
        body: JSON.stringify({
            "height": currentMeme.height,
            "id": currentMeme.id,
            "tags": updatedTag,
            "title": updatedTitle,
            "uploaded": currentMeme.uploaded,
            "url": currentMeme.url,
            "width": currentMeme.width
        }),
        headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
        method: 'PUT'
    })
    .then((response : any) => {
        if (!response.ok) {
            // Error State
            alert(response.statusText + " " + url)
        } else {
            location.reload()
        }
    })
}
```

:page_with_curl: 2. Bind this method to self by adding this to the constructor of `MemeDetail.tsx`
```javascript
this.updateMeme = this.updateMeme.bind(this)
```

:page_with_curl: 3. We want to call the method when the user clicks on 'Save' after opening the edit modal. Find this snippet of code
```javascript
<button type="button" className="btn" onClick={this.methodNotImplemented}>Save</button>
```
and change it so it looks like this
```javascript
<button type="button" className="btn" onClick={this.updateMeme}>Save</button>
```
Click on a meme, press 'edit' and try editing a meme!

## 6. Delete existing meme (DELETE) :put_litter_in_its_place:

To delete a meme, we use this endpoint: `http://phase2apitest.azurewebsites.net/api/meme/[id]` where id is the id of the meme we want to delete.

:page_with_curl: 1. In `MemeDetail.tsx`, add the following function (below `updateMeme`)
```javascript
private deleteMeme(id: any) {
    const url = "http://phase2apitest.azurewebsites.net/api/meme/" + id

    fetch(url, {
        method: 'DELETE'
    })
    .then((response : any) => {
        if (!response.ok) {
            // Error Response
            alert(response.statusText)
        }
        else {
            location.reload()
        }
    })
}
```
This action is the simplest out of the 4. We make the DELETE request and reload the page. If there is an error, we show it in an alert.

:page_with_curl: 2. We want to call this method when the user clicks 'delete'. Find this snippet
```javascript
<div className="btn btn-primary btn-action" onClick={this.methodNotImplemented.bind(this, currentMeme.id)}>Delete </div>
```
and change it so it looks like this
```javascript
<div className="btn btn-primary btn-action" onClick={this.deleteMeme.bind(this, currentMeme.id)}>Delete </div>
```

:page_with_curl: 3. Now that we're not using `methodNotImplemented`, we can delete it

Try deleting a meme (careful which meme you delete because there's no undo!)


## :tada: Congrats! you now have your own personal meme bank - Next up, API!