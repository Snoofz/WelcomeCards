# WelcomeCard Class

## Overview

The `WelcomeCard` class is a utility for creating and sending welcome cards with custom background images and user information in Discord servers.

## Installation

To use the `WelcomeCard` class, ensure you have Node.js installed on your system. Then, follow these steps:

1. Install the required dependencies by running:
   ```
   npm install canvas discord.js
   ```

2. Include the `WelcomeCard` class in your project.

## Usage

1. Import the `WelcomeCard` class into your script:

   ```javascript
   const WelcomeCard = require('./WelcomeCard');
   ```

2. Create an instance of the `WelcomeCard` class, passing an object with configuration options:

   ```javascript
   const welcomeCard = new WelcomeCard({
     discordClient: yourDiscordClient,
     backgroundImage: 'path/to/background/image.jpg',
     cardDescription: 'Your welcome message here.',
     cardTitle: 'Welcome to the server, [username]!',
     canvasWidth: 600,
     canvasHeight: 300,
     avatarBorderSide: 4,
     offset: 18,
   });
   ```

   Replace `yourDiscordClient` with your Discord.js client instance and provide the path to your background image, welcome message, and card title. You can also customize canvas dimensions, avatar border size, and offset as needed.

3. Call the `send` method of the `WelcomeCard` instance to send the welcome card to a Discord channel:

   ```javascript
   const channelId = 'yourChannelId';
   const member = await yourDiscordClient.users.fetch('memberId');
   welcomeCard.send(channelId, member);
   ```

   Replace `yourChannelId` with the ID of the Discord channel where you want to send the welcome card, and `memberId` with the ID of the member you want to welcome.

## Example

```javascript
const { Client } = require('discord.js');
const WelcomeCard = require('./WelcomeCard');

const client = new Client();

client.once('ready', () => {
  console.log('Bot is ready');
});

client.on('guildMemberAdd', async (member) => {
  const welcomeCard = new WelcomeCard({
    discordClient: client,
    backgroundImage: 'path/to/background/image.jpg',
    cardDescription: 'Welcome to our server! Enjoy your stay.',
    cardTitle: 'Welcome to the server, [username]!',
    canvasWidth: 600,
    canvasHeight: 300,
    avatarBorderSide: 4,
    offset: 18,
  });

  const channelId = 'yourChannelId';
  welcomeCard.send(channelId, member);
});

client.login('yourBotToken');
```

Replace `'yourBotToken'` with your Discord bot token, and `'yourChannelId'` with the ID of the Discord channel where you want to send the welcome card.
