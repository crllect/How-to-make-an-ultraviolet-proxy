# How to Set Up Ultraviolet in Your Own Proxy

This guide covers the setup of Ultraviolet (UV), including creating a new frontend or integrating an existing one. If you need assistance, feel free to DM me on Discord @crllect.

## Step 1: Download the Template

Start by downloading the template available in this repository.

## Step 2: Clone Ultraviolet

1. Clone the most recent version of Ultraviolet from [here](https://github.com/titaniumnetwork-dev/Ultraviolet/releases). You can either build it yourself or download the `.tgz` file.
2. Unzip the downloaded file.
3. Inside the `dist` directory, download all `.js` files and place them in `public/uv`.

- **Note**: I have attached my own modified UV files, but they may be out of date. If you dont want to clone and build everything, just use my files

## Step 3: Adding Frontend

Place all your frontend code, including assets, inside the `public` directory of the template.

- **Note**: The `.gitignore` in the template already excludes node modules.
- Open the `server.js` file in the template and modify it according to the instructions provided in the file.

## Step 4: Frontend Integration

In your html, add the following to `<head>`
```html
<script src="/uv/uv.bundle.js"></script>
<script src="/uv/uv.config.js"></script>

<script>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/uv/sw.js", {
        scope: __uv$config.prefix,
      });
    });
  }
</script>
```

Now, if you know what your doing, in your JS, all you need to do is this:
`location.href = __uv$config.prefix + __uv$config.encodeUrl(url);`

If that didn't make sense, its ok.

Im going go ahead and assume you know the basics of html and css,

Start off by having an iframe window with no src. Add the class and iframeWindow, you can name it something else, but change the JS appropriately.
```html
<iframe id="iframeWindow" class="iframeWindow"></iframe>
```

Then add a text input to your html:
```html
<input type="text" id="urlInput" placeholder="Enter URL here">
<button id="searchButton">Search Text</button>
```

add this to your JS, if you changed the class or ID name, change it in here too:
```js
document // makes it so you can press enter to submit as opposed to just being able to press a button
    .getElementById("urlInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });

document.getElementById("searchButton").onclick = function (event) {
    event.preventDefault();

    let url = document.getElementById("urlInput").value; // If no periods are detected in the input, search google instead
    let searchUrl = "https://www.google.com/search?q=";

    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) { // if no http or https is detected, add https automatically
            url = "https://" + url;
        }
    }

    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
};
```

## Step 5: Building It

**Only do this the first time**:
1. Open a terminal in the directory of your project in VSCode, this is as easy and `ctrl-shift-C` on your project, and run `npm i @tomphttp/bare-server-node express`
2. Add `"type": "module"` to `package.json`. Example:
Before
```json
{
  "dependencies": {
    "@tomphttp/bare-server-node": "^2.0.1",
    "express": "^4.18.2"
  },
}
```
After:
```json
{
  "dependencies": {
    "@tomphttp/bare-server-node": "^2.0.1",
    "express": "^4.18.2"
  },
  "type": "module"
}
```
- **Note**: don't forget the comma after the ending curly bracket of `dpendancies`

**Every time you start it up**:
You can start it by typing `node server.js` into the terminal window, you can now visit it localy by typing `localhost:Port` into a web browser

- **Note**: The default port is 8080 
