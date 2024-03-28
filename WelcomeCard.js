const Discord = require("discord.js");

class WelcomeCard {
  constructor({
    discordClient,
    backgroundImage,
    cardDescription,
    cardTitle,
    canvasWidth = 600,
    canvasHeight = 300,
    avatarBorderSide = 4,
    offset = 18,
  }) {
    this.discordClient = discordClient;
    this.backgroundImage = backgroundImage;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.cardDescription = cardDescription;
    this.avatarBorderSide = avatarBorderSide;
    this.cardTitle = cardTitle;
    this.createCanvas = require("canvas").createCanvas;
    this.loadImage = require("canvas").loadImage;
    this.registerFont = require("canvas").registerFont;
    this.offset = offset;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async send(channelId, member) {
    let welcomeChannel = await this.discordClient.channels.cache.get(
      channelId.toString()
    );

    const canvasWidth = this.canvasWidth;
    const canvasHeight = this.canvasHeight;
    const borderSize = this.avatarBorderSide;
    const offset = this.offset;
    const avatarSize = 128;

    const canvas = this.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    const background = await this.loadImage(this.backgroundImage);
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    const circleDiameter = avatarSize + borderSize * 2;
    const circleRadius = circleDiameter / 2;
    const avatarX = (canvasWidth - circleDiameter) / 2;
    const avatarY = offset;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      avatarX + circleRadius,
      avatarY + circleRadius,
      circleRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarX + circleRadius,
      avatarY + circleRadius,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    const avatar = await this.loadImage(
      member.user.displayAvatarURL({ format: "png", dynamic: false, size: 128 })
    );
    ctx.drawImage(avatar, avatarX, avatarY, circleDiameter, circleDiameter);
    ctx.restore();

    ctx.strokeStyle = "white";
    ctx.lineWidth = borderSize;
    ctx.beginPath();
    ctx.arc(
      avatarX + circleRadius,
      avatarY + circleRadius,
      circleRadius - borderSize / 2,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `Welcome to ${member.guild.name},`,
      canvasWidth / 2,
      230 - offset * 2
    );
    ctx.font = "bold 36px Arial";
    ctx.fillText(
      this.capitalizeFirstLetter(member.displayName),
      canvasWidth / 2,
      270 - offset * 2
    );

    const memberCount = member.guild.memberCount;
    const memberPosition =
      member.guild.members.cache
        .filter((m) => !m.user.bot)
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .array()
        .indexOf(member) + 1;

    ctx.font = "24px Arial";
    ctx.fillText(
      `You're our ${this.getOrdinalSuffix(
        memberPosition
      )} member of the server!`,
      canvasWidth / 2,
      310 - offset * 2
    );

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "welcome-card.png"
    );

    const formattedTitle = this.cardTitle.replace(
      "[username]",
      member.displayName
    );

    const embed = new Discord.MessageEmbed()
      .setTitle(formattedTitle)
      .setDescription(this.cardDescription)
      .setColor("#ffa500")
      .attachFiles([attachment])
      .setImage("attachment://welcome-card.png");

    welcomeChannel.send(embed);
  }

  getOrdinalSuffix(i) {
    i = parseInt(i);
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }
}

module.exports = WelcomeCard;
