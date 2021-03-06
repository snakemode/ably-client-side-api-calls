# Ably, front-end focused JavaScript SDK Demo

This is a demo of using the Ably promise-based SDK in the front end of your webapp.

It uses [Token Authentication](https://www.ably.io/documentation/core-features/authentication#token-authentication)
with a [Token Request](https://www.ably.io/documentation/realtime/authentication#token-request) created on the service side and handed to the
`Ably-Realtime` client to authenticate and keep your API key safe.

For the purposes of the demo, we request some `TFL Tube Data` and display the history.

Because we're using the `Promises` API, we can use async/await in our JavaScript code that runs in the browser.

## To run this demo
```bs
npm install
npm start
```


## How it works

### On the server side

We're running an Express.js server - `server.js`.

```js
const express = require("express");
const Ably = require('ably/promises');
const client = new Ably.Realtime(process.env.ABLY_API_KEY);
```
First, it includes both `express` and the `ably/promises` SDK using require.
Next, we create a new instance of the *Ably.Realtime* `client` passing `process.env.ABLY_API_KEY` to it's constructor.

`process.env.ABLY_API_KEY` is a `glitch` specific (or anything else that uses `dotenv`) hook
which loads the contents of the file `.env` into your `Node` environment.

Make sure you have a `.env` file that looks something like this

```bash
ABLY_API_KEY=yourably:apikeyhere
PORT=3000
```
Next, we create our express instance and map the default route to serve our `views/index.html` file.

```js
const app = express();
app.get("/", async (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});
```

This is the default `glitch` `Express.js` example code.

**We're now going to create an additional route to create Ably Token Request objects.**

```js
app.get("/api/createTokenRequest", async (request, response) => {
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-client-side-api-calls-demo' });
  response.send(tokenRequestData);
});
```

Using the `client` we created earlier, we can now create a token request. This API is served on the url `/api/createTokenRequest`.
There's nothing special about that URL, we just need to make sure our client can access it. The `clientId` should be meaningful and distinct.

The `TokenRequest` that is generated by this SDK call happens without calling the Ably servers, and allows the client side SDK to authenticate
because the `TokenRequest` is signed with your API key on the server before it's sent to Ably.

The `permissions` applied to the temporary token Ably returns to your client are **inherited** from your API key, and configured in your Ably dashboard.

```js
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
```
And finally start the Express application.

### On the client side

For our UI, we have a single file in `views/index.html`.

There are a few things going on here, firstly, in the `<head>` we include the Ably SDK in a script tag from the Ably CDN.

```html
<script src="https://cdn.ably.io/lib/ably.min-1.js"></script>
```
In the `<body>` of the document, we create a `<div>` to put Ably responses into

```html
<main>
  <h2>Oh hi, let me just grab some history from Ably!</h2>
  <div id="history" class="historyContainer"></div>
</main>
```

And finally, a `<script>` block to connect to, and use, the Ably API.

```js
<script>
  console.log("Oh hai! 🖤");

  const resultsDiv = document.getElementById("history");

  async function connect() {
    const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
    const channelId = `[product:ably-tfl/tube]tube:northern:940GZZLUKSX:arrivals`;
    const channel = await ably.channels.get(channelId);
    await channel.attach();

    const resultPage = await channel.history(); 

    for (const item of resultPage.items) {
      const result = document.createElement("div");
      result.classList.add("item");
      result.innerHTML = JSON.stringify(item);
      resultsDiv.appendChild(result);
    }
  }

  connect();    
</script>   
```

This script block

- Finds our div with the id `history`.
- Defines a new **async** function called `connect()`
- Calls our `connect();` function.

The code is inside an *async* function so we can use async/await in our browser.

The body of the connect function is an example of using Ably to query TFL for northern line journies to Kings Cross, but for this particular example
it's important to look at the line

```js
const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
```

Here we configure our Ably SDK to 
- Use the `Promise` client (which supports async/await)
- Pass a configuration object with an `authUrl`.

When the client is created, it'll call our Express.js APIs `createTokenRequest` function, and round-trip to Ably
to get a short-lived authentication token for subsequent API calls, renewing it's token as required automatically.

# TL;DR

To configure `TokenRequests`

- Add a valid Ably API key to your server side .env file (or elsewhere).
- Add an Express.js route that calls `client.auth.createTokenRequest`
- Return that token data to the client
- Create a client side instance of the SDK passing a configuration object with the URL of your API as the parameter `authUrl`
- Use the SDK as normal
- Using the Promise supporting client is optional, but the code is easier to understand if you do.
