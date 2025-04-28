const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const { getOrCreatePlayer } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("[PREMIUM] Chỉnh 💵 của con nghiện")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addMentionableOption((option) =>
      option.setName("to").setDescription("Ổ hoặc Con Nghiện để chỉnh 💵").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Số 💵")
        .setMinValue(0)
        .setRequired(true),
    ),
  async execute(interaction) {
    const to = interaction.options.getMentionable("to");
    const ids = to.members ? [...to.members.keys()] : [to.user.id]
    const amount = interaction.options.getInteger("amount");
    const myDb = await db.get(interaction.guildId);
    const preBalances = {}
    for await (const userId of ids) {
      let player = myDb.players.find((p) => p.userId == userId);
      if (!player) {
        const initPlayer = { userId: userId, bets: [], balance: 0 };
        myDb.players.push(initPlayer);
        player = initPlayer;
      }
      preBalances[userId] = player.balance
      player.balance = amount;
    }
    db.set(interaction.guildId, myDb);
    const prebalString = ids.map(id => `**${preBalances[id]} 💵**`).join(' / ')
    await interaction.reply(
      `Chủ nợ ${interaction.user} đã ảo thuật biến tiền của ${to} từ ${prebalString} sang **${amount} 💵**.`.slice(0, 1999)
    );
  },
};
