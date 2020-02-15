const Discord = require('discord.js');
const scheduleJob = require('node-schedule').scheduleJob;
const client = new Discord.Client({autoReconnect: true});

const DEVNULL_CHANNEL_ID ='349421970083020801'
const MIN_AGE = 5 // Minutes

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const devnullChannel = client.channels.get(DEVNULL_CHANNEL_ID)

  scheduleJob('*/10 * * * *', () => devnullChannel.fetchMessages({limit: 100})
    .then(messages => devnullChannel.bulkDelete(messages.array().sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .slice(1) // Don't delete the newest message
      // Don't delete any other messages that are too new
      .filter(m => Date.now() - new Date(m.createdTimestamp).valueOf() > MIN_AGE * 60 * 1000)
      .map(m => m.id)
    ))
    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
    .catch(console.error)
  );
});

client.login(process.env.DEVNULL_TOKEN);
