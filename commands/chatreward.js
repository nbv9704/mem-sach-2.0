const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatreward")
    .setDescription("[PREMIUM] Chỉnh 💵 bú được qua chat")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addIntegerOption((option) =>
      option
        .setName("reward")
        .setDescription("Cứ chat tầm ~50 tin nhắn là có 1 💵 nhá :3")
        .setMinValue(0)
        .setRequired(true),
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger("reward");
    const myDb = await db.get(interaction.guildId);
    const prevAmount = myDb.reward;
    myDb.reward = amount;
    db.set(interaction.guildId, myDb);
    await interaction.reply(
      `Chủ nợ ${interaction.user} đã chỉnh tiền lương của những con nghiện từ **${prevAmount} 💵** thành **${amount} 💵**`,
    );
  },
};
