/*globals Ably */
console.log("Oh hai! 🖤");

async function connect() {
  const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
  const channelId = `[product:ably-tfl/tube]tube:northern:940GZZLUKSX:arrivals`;
  const channel = await ably.channels.get(channelId);
  await channel.attach();
  
  channel.subscribe(msg => {
    console.log(msg);
  });
  
  const resultPage = await channel.history();
  console.log("History retrieved for northern line");  
  console.log(resultPage);
  
  
  
}

connect();