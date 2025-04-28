const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const { getOrCreatePlayer } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Chuyển 💵 cho con nghiện khác")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Chọn con nghiện")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Số 💵")
        .setMinValue(1)
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const myDb = await db.get(interaction.guildId);
    const from = await getOrCreatePlayer(interaction, myDb);
    let to = myDb.players.find((p) => p.userId == user.id);
    if (!to) {
      const initPlayer = { userId: user.id, bets: [], balance: 0 };
      myDb.players.push(initPlayer);
      to = initPlayer;
    }
    if (from.balance < amount) {
      await interaction.reply({
        content: `Nghèo như chó mà đòi chuyển tận ${amount} 💵.\nTài sản còn mỗi ${from.balance} 💵.`,
        ephemeral: true,
      });
      return;
    }
    from.balance -= amount;
    to.balance += amount;
    db.set(interaction.guildId, myDb);
    await interaction.reply(`${interaction.user} đã bố thí ${amount} 💵 cho ${user}.`);
  },
};
