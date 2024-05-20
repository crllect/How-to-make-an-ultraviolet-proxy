# How to make a Ultraviolet proxy, or connect it with your frontend

This guide covers the setup of Ultraviolet (UV), including creating a new basic frontend or integrating your existing one. If you need assistance, feel free to DM me on Discord @crllect.

## PREFACE

This is for guide pre-2.0 UV. If you need help with ^2.0, join the [Titanium Network discord](https://discord.gg/unblock). Again, contact me on discord (@crllect) if you need help with anything. I am usually active from from 7 pm est to 11:30 pm est.

## Step 1: Download the Template

Start by downloading the template available in this repository.

## Step 2: Get the Ultraviolet Files

### a. Use my files in the template

I have attached my own UV files, but they may be out of date. If you dont want to clone and build everything or unzip some files, just use my files

(so dont modify the template)

### b. Download pre-2.0 Files From the Ultraviolet GitHub

1. Delete the UV files in the template

2. Clone the most recent version of Ultraviolet that is **pre-2.0** from [here](https://github.com/titaniumnetwork-dev/Ultraviolet/releases). You can either build it yourself or download the `.tgz` file.

3. Unzip the downloaded file.

- **Note**: If you are having issues unzipping the file, search "tgz to zip" online, and then convert it. Unzip the file normally
  
4. Inside the `dist` directory (`titaniumnetwork-dev-ultraviolet-x.x.x/package/dist`), download all `.js` files and place them in `public/uv`. All of the `.map` files are used for unminifying the other UV files. If you dont plan on modifying the UV files, you dont need to download the `.map` files.

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

    let url = document.getElementById("urlInput").value; // if no periods are detected in the input, search google instead
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
1. Open a terminal in the directory of your project in VSCode, this is as easy and `ctrl-shift-C` on your project, and run `npm i`

- **Note**: Renaming the template after running the next command map cause it to stop working. If you rename the template you can just run `npm i` again it should fix itself


2. Add `"type": "module"` to `package.json`. Example:
   ### Only if you didnt use my package.json
Before:
```json
{
  "dependencies": {
    "@tomphttp/bare-server-node": "^2.0.1",
    "express": "^4.18.2"
  }
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
- **Note**: don't forget the comma after the ending curly bracket of `dependencies`

**Every time you start it up**:
You can start it by typing `node server.js` into the terminal window, you can now visit it localy by typing `localhost:Port` into a web browser

- **Note**: The default port is 8080 

## Step 6: Deploying It

There are infinitely many ways to do this, replit does not any form of proxies, and has spotty uptime when you can get it to work, so that will usually be a no-go. Many hosts such as vercel are static hosts, meaning they cant support the backend logic required for UltraViolet (atleast on paper).


**Solution 1**: In vercel and render (I havent tested render), you can make server file (usually `index.js` or `server.js`) not just host the uv backend, but instead also host some basic express routes such as `/` and `/index`. You can make those routes point to things in your public folder.

**Example of Solution 1**: https://github.com/crll3ct/UV-in-one-url


**Solution  2**: A solution I have found is to use either a bare metal or cheap online service to host the bare server, and something like vercel to host the frontend

**Example of Solution 2**: https://github.com/crllect/focus-bare

 - **Note**: If you end up using two seperate services for front end and backend, then you need to go to `public/uv/uv.config.js` and change the bare server to your bare server.

**Example**:
### `uv.config.js`
```js
/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'INSERT YOUR BARE SERVER HERE',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
```
---

