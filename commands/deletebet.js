const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");
const {
  getOrCreatePlayer,
  printAllBet,
  betToOffer,
  prevbetAutocomplete,
} = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletebet")
    .setDescription("Xóa cược")
    .addStringOption((option) =>
      option
        .setName("bet")
        .setDescription("Chọn cược")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const myDb = await db.get(interaction.guildId);
    const field = interaction.options.getFocused(true);
    const player = await getOrCreatePlayer(interaction, myDb);
    prevbetAutocomplete(interaction, myDb, player, field);
  },
  async execute(interaction) {
    const betgroupUid = interaction.options.getString("bet");
    const myDb = await db.get(interaction.guildId);
    const player = await getOrCreatePlayer(interaction, myDb);
    const betgroupToDelete = player.bets.find(
      (betgroup) => betgroup.uid == betgroupUid,
    );
    if (!betgroupToDelete) {
      await interaction.reply({
        content: `Không thấy cược.`,
        ephemeral: true,
      });
      return;
    }
    const isLocked = betgroupToDelete.combination.some(
      (b) => betToOffer(b, myDb).locked,
    );
    if (isLocked) {
      await interaction.reply({
        content: `Một hoặc nhiều kèo trong cược của bạn đã bị khóa.`,
        ephemeral: true,
      });
      return;
    }
    player.balance += betgroupToDelete.amount;
    player.balance = Math.round(player.balance*10)/10
    player.bets = player.bets.filter(
      (betgroup) => betgroup.uid != betgroupToDelete.uid,
    );
    db.set(interaction.guildId, myDb);
    await interaction.reply(
      `${interaction.user} hèn như chó và vừa rút kèo:\n${printAllBet(betgroupToDelete, myDb)}\n\nĐã hoàn lại **${betgroupToDelete.amount} 💵**`,
    );
  },
};
