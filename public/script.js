/*globals Ably */
console.log("Oh hi! 🖤");

async function connect() {
  const ably = new Ably.Realtime({ authUrl: '/api/createTokenRequest' });
  const channelId = `[product:ably-tfl/tube]tube:northern:940GZZLUKSX:arrivals`;
  const channel = await ably.channels.get(channelId);
  await channel.attach();
  
  channel.subscribe(msg => {
    console.log(msg);
  });
  
  //const resultPage = await channel.history(channel, { untilAttach: true, limit: 1 });
  //console.log("History retrieved for northern line");
  
  //const recentMessage = resultPage.items[0] || { data: [] }; 
  //console.log(recentMessage.data);
  
}

connect();