/*globals Ably */
/*console.log("Oh hai! 🖤");
const resultsDiv = document.getElementById("history");

async function connect() {
  const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
  const channelId = `[product:ably-tfl/tube]tube:northern:940GZZLUKSX:arrivals`;
  const channel = await ably.channels.get(channelId);
  await channel.attach();
  
  channel.subscribe(msg => {
    console.log(msg);
  });
  
  const resultPage = await channel.history(); 
  
  for (const item of resultPage.items) {
    
    const result = document.createElement("div");
    result.classList.add("item");
    result.innerHTML = JSON.stringify(item);
    resultsDiv.appendChild(result);
    
  }
  
}

connect();*/