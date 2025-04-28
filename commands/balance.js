const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");
const { printOffers, getOrCreatePlayer } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Tài sản")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Đối tượng nghiện")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const myDb = await db.get(interaction.guildId);
    const player = myDb.players.find((p) => p.userId == user.id);
    if (player?.balance) {
      await interaction.reply(`${user} đang sở hữu khối tài sản **${player.balance} 💵**.`);
    } else {
      await interaction.reply(`${user} còn mỗi **0 💵**. Nghèo vailon`);
    }
  },
};
