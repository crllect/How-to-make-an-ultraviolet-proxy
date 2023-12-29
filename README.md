# How to Set Up Ultraviolet in Your Own Proxy

This guide covers the setup of Ultraviolet (UV), including creating a new frontend or integrating an existing one. If you need assistance, feel free to DM me on Discord @crllect.

## Step 1: Download the Template

Start by downloading the template available in this repository.

## Step 2: Clone Ultraviolet

1. Clone the most recent version of Ultraviolet from [here](https://github.com/titaniumnetwork-dev/Ultraviolet/releases). You can either build it yourself or download the `.tgz` file.
2. Unzip the downloaded file.
3. Inside the `dist` directory, download all `.js` files and place them in `public/uv`.

## Step 3: Frontend Integration

Place all your frontend code, including assets, inside the `public` directory of the template.

- **Note**: The `.gitignore` in the template already excludes node modules.
- Open the `server.js` file in the template and modify it according to the instructions provided in the file.
