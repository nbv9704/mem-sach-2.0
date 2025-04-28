const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const { printOffers, printOdds } = require("../utils");
const { uid } = require("uid/secure");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newoffer")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Tạo kèo")
    .addStringOption((option) =>
      option
        .setName("team1name")
        .setDescription("Tên lựa chọn 1")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("team2name")
        .setDescription("Tên lựa chọn 2")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("team1win")
        .setDescription("% team 1 ăn")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("draw")
        .setDescription("% hòa(Skip nếu bạn không tin có hòa)")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(false),
    )
    .addIntegerOption((option) =>
      option
        .setName("vigorish")
        .setDescription("% thuế nhà cái")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(false),
    ),
  async execute(interaction) {
    const team1name = interaction.options.getString("team1name").slice(0,50);
    const team2name = interaction.options.getString("team2name").slice(0,50);
    const team1win = interaction.options.getInteger("team1win");
    const draw = interaction.options.getInteger("draw") || 0;
    const vigorish =
      interaction.options.getInteger("vigorish") === null
        ? 3
        : interaction.options.getInteger("vigorish");
    // Calculate returns
    const team2win = 100 - team1win - draw;
    const team1ret =
      Math.round((100 / team1win) * (1 - vigorish * 0.01) * 100) / 100;
    const team2ret =
      Math.round((100 / team2win) * (1 - vigorish * 0.01) * 100) / 100;
    const drawret =
      draw != 0
        ? Math.round((100 / draw) * (1 - vigorish * 0.01) * 100) / 100
        : 0;
    const myDb = await db.get(interaction.guildId);
    const newOffer = {
      uid: uid(),
      team1name,
      team2name,
      team1ret,
      team2ret,
      drawret,
      vigorish,
    };
    await db.set(interaction.guildId, {
      ...myDb,
      offers: [...myDb.offers, newOffer],
    });
    const changedDb = await db.get(interaction.guildId);
    await interaction.reply(
      `Đã thêm kèo mới:\n${printOdds(newOffer)}\n\nCheck tất cả các kèo hiện tại bằng **/offers**`,);
  },
};
