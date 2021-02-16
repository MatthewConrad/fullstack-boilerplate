# Full-Stack Boilerplate

A template for my personal full-stack apps, using TypeScript, Express, React, and SCSS.

## Quick Start

For now, the boilerplate is only avaiable through the git repo:

```
git clone https://github.com/MatthewConrad/fullstack-boilerplate.git DIRNAME
```

Once cloned, you will need to run `npm install`, then either `npm run build` or `npm run watch` to generate the JS and CSS that will be served by Express.

If you haven't already started the server with `npm run watch`, running `npm run start` will start the server on port 5000. You should see `Hello World!` when visiting `localhost:5000` in your browser.

Before deploying your application, be sure to change the `<title>`, `<description>`, and `<keywords>` in `build/index.html`, as well as the favicon in `src/client/assets/favicon.ico`.

## Features

-   ESLint and Prettier preconfigured for TypeScript and React
-   Basic CSS reset
-   Watch scripts for SCSS, client code, and server code
-   Script to watch all project elements concurrently, with automatic reloading in browser
