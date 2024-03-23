document // makes it so you can press enter to submit as opposed to just being able to press a button
    .getElementById("urlInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("search-button").click();
        }
    });

document.getElementById("search-button").onclick = function (event) {
    event.preventDefault();

    let url = document.getElementById("urlInput").value; // If no periods are detected in the input, search google instead
    let searchUrl = "https://www.google.com/search?q=";

    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            // if no http or https is detected, add https automatically
            url = "https://" + url;
        }
    }

    window.location = __uv$config.prefix + __uv$config.encodeUrl(url);
    var win = window.open();
    var encUrl = `${__uv$config.prefix}${__uv$config.encodeUrl(url)}`;
    var iframe = win.document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.src = encUrl;
    win.document.body.appendChild(iframe);
    win.document.body.style.overflow = "hidden";
};
