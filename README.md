# Ably, front-end focused JavaScript SDK Demo

This is a demo of using the Ably promise-based SDK in the front end of your webapp.

It uses [Token Authentication](https://www.ably.io/documentation/core-features/authentication#token-authentication)
with a [Token Request](https://www.ably.io/documentation/realtime/authentication#token-request) created on the service side and handed to the
`Ably-Realtime` client to authenticate and keep your API key safe.

For the purposes of the demo, we request some `TFL Tube Data` and display the history.

Because we're using the `Promises` API, we can use async/await in our JavaScript code that runs in the browser.


## How it works

# On the server side

We're running an Express.js server - `server.js`.

```js
const express = require("express");
const Ably = require('ably/promises');
const client = new Ably.Realtime(process.env.ABLY_API_KEY);
```
First, it includes both `express` and the `ably/promises` SDK using require.
Next, we create a new instance of the Ably.Realtime `client` passing `process.env.ABLY_API_KEY` to it's constructor.

process.env.ABLY_API_KEY is a `glitch` specific (or anything else that uses dotenv) hook
which loads the contents of the file `.env` into your `Node` environment.

Make sure you have a `.env` file that looks something like this

```bash
ABLY_API_KEY=yourably:apikeyhere
```

Next, we create our express instance and map our default route to serve our `views/index.html` file.

```js
const app = express();
app.use(express.static("public"));

app.get("/", async (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});
```

This is the default `glitch` `Express.js` example code.

We're now going to create an additional route to create `Ably Token Request` objects.

```js
app.get("/api/createTokenRequest", async (request, response) => {
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-client-side-api-calls-demo' });
  response.send(tokenRequestData);
});
```

We're using the `client` we created earlier to create a token request. This API is served on the url `/api/createTokenRequest`.
There's nothing special about that URL, we just need to make sure our client can access it. The `clientId` should be meaningful and distinct.

```js
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
```
Finally we start our Express application.

# On the client side
