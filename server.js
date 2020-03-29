const express = require("express");
const Ably = require('ably/promises');
const client = new Ably.Realtime(process.env.ABLY_API_KEY);

const app = express();
app.use(express.static("public"));

app.get("/", async (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/createTokenRequest", async (request, response) => {
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-client-side-api-calls-demo' });
  response.send(tokenRequestData);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});