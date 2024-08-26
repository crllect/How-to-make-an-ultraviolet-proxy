# How to make a Ultraviolet proxy, or connect it with your frontend

This guide covers the setup of Ultraviolet (UV), including creating a new basic frontend or integrating your existing one. If you need assistance, feel free to DM me on Discord @crllect. Huge thanks to @percslol for help with migrating to 3.x.x

## PREFACE

If anything here should be changed, please feel free to submit a pr or dm me directly. If anything here was at all useful, please consider staring the repo, it helps a ton!

## How Ultraviolet Actually Works

UV has a service worker that handles requests, it also has a rewriter, it intercepts all requests and rewrites them, then returns them. This is called an interception proxy. A bare or wisp server can be hosted, and when a request is sent to the client, it forwards that request to the bare/wisp server, and it gets sent back to ultraviolet so can rewrite and handle that request and serve it back to you.

TL;DR: UV has route.


## Step 1: Download the Template

Clone the template or fork the repo

## Step 2: Adding/Integrating Frontend

### If you ***DON'T*** have already existing frontend

The template, by default has some basic code that shows how to setup a frontend, a backend, and some clientside code that should always be running.

- **Note**: The `.gitignore` in the template already excludes node modules.
- Open the `server.js` file in the template and modify it according to the instructions provided in the file.

### If you have already existing frontend

Place all your frontend code, including assets, inside the `public` directory of the template.

In your html, add the following to `<head>`
```html
<script src="/uv/uv.bundle.js"></script>
<script src="/uv/uv.config.js"></script>
<script src="/baremux/index.js"></script>

<script>
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/uv/sw.js");
    });
}
</script>
```

## **IMPORTANT**: Only Use UV Inside of an iFrame

### Now, if you know what your doing, in your JS, all you need to do is this:
`location.href = __uv$config.prefix + __uv$config.encodeUrl(url);`

### If you dont:

*its ok.*

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
const connection = new BareMux.BareMuxConnection("/baremux/worker.js")
const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + location.host + "/bare/"
document // makes it so you can press enter to submit as opposed to just being able to press a button
    .getElementById("urlInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });

document.getElementById("searchButton").onclick = async function (event) {
    event.preventDefault();

    let url = document.getElementById("urlInput").value; // if no periods are detected in the input, search google instead
    let searchUrl = "https://www.google.com/search?q=";

    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) { // if no http or https is detected, add https automatically
            url = "https://" + url;
        }
    }
	if (!await connection.getTransport()) {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
};
```
## Step 4: Switching connections

One of the most impressive features of UV 3.x.x is the ability to switch connections, so how is this actually done?

Have something like this in your html somewhere
```html
<select id="switcher">
    <option value="">--Please Choose an Option--</option>
    <option value="epoxy">Epoxy</option>
    <option value="bare">Bare</option>
</select>
```

and something like this in your js

```js
document.getElementById("switcher").onselect = async function (event) {
    switch (event.target.value) {
        case "epoxy":
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            break;
        case "bare":
            await connection.setTransport("/baremod/index.mjs", [bareUrl]);
            break;
    }
}
```

Whats actually happening here, is that your html is showing a dropdown with the options Epoxy and Bare, and this peice of js simply looks through any given page to see if that drop down is present, if it is, it will switch from bare or epoxy depending on what you set it too. It defaults to epoxy.

## Step 5: Building It

**Only do this the first time**:
1. Open a terminal in the directory of your project in VSCode, this is as easy and `ctrl-shift-C` on your project, and run `npm i`

- **Note**: Renaming the template after running the next command map cause it to stop working. If you rename the template you can just run `npm i` again it should fix itself


2. Add `"type": "module"` to `package.json`. Example:
   ### Only if you didnt use my package.json
Before:
```json
{
  "dependencies": {
    "@titaniumnetwork-dev/ultraviolet": "^3.2.6",
    "@tomphttp/bare-server-node": "^2.0.3",
    "wisp-server-node": "^1.1.3",
    "@mercuryworkshop/bare-mux": "^2.0.3",
    "@mercuryworkshop/epoxy-transport": "^2.1.3",
    "@mercuryworkshop/bare-as-module3": "^2.2.2",
    "express": "^4.18.2"
  }
}
```

After:
```json
{
  "dependencies": {
    "@titaniumnetwork-dev/ultraviolet": "^3.2.6",
    "@tomphttp/bare-server-node": "^2.0.3",
    "wisp-server-node": "^1.1.3",
    "@mercuryworkshop/bare-mux": "^2.0.3",
    "@mercuryworkshop/epoxy-transport": "^2.1.3",
    "@mercuryworkshop/bare-as-module3": "^2.2.2",
    "express": "^4.18.2"
  },
  "type": "module"
}
```
- **Note**: don't forget the comma after the ending curly bracket of `dependencies`

**HOW DO I START IT???**:
You can start it by typing `node server.js` into the terminal window, you can now visit it localy by typing `localhost:Port` into a web browser

- **Note**: The default port is 8080

## Step 6: Deploying It

*ur fucked (if ur broke)*

You cant use websockets on vercel, so you *can* use bare on vercel, but to be completely honest, its not worth it if you want to use UV 3.x.x. The entire appeal of UV 3.x.x is being able to switch bare clients and moving to a more secure system like wisp, which cannot be done in vercel due to the lack of support for websockets because of vercel being a serverless platform.

My recomendation for deploying on vercel, is to use this guide (also by me):
https://github.com/crllect/UV-on-vercel

Now, if you *are* willing to pay, almost any hosting service or vps supports node. So if you use a hosting service, you should follow their instructions. If you decide to use a vps, you will need to follow similar steps to a dev build, but you will also need to connect your domain, set everything to public, setup ssl, and other steps. So if you opt for using a vps, you should already know some basic IT consepts.
