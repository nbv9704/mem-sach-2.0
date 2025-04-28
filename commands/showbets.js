const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");
const { getOrCreatePlayer, printAllBet } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showbets")
    .setDescription("Hiện tất cả các cược")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Chọn con nghiện")
        .setRequired(false),
    ),
  async execute(interaction) {
    const myDb = await db.get(interaction.guildId);
    const user = interaction.options.getUser("user") || interaction.user;
    const player = myDb.players.find((p) => p.userId == user.id);
    if (player?.bets?.length > 0) {
      await interaction.reply(
        `Những cược hiện tại ${user}:\n\n─────────────────────────────\n${player.bets.map((betgroup) => printAllBet(betgroup, myDb)).join("\n─────────────────────────────\n")}\n─────────────────────────────\n`,
      );
    } else {
      await interaction.reply({
        content: `${user} đã cải tà quy chính và không có cược nào.\nThôi nghiện đi, dùng **/bet** để nghiện nhé :3.`,
        ephemeral: true,
      });
    }
  },
};
