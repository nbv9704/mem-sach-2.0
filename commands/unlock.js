const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const { printOdds } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Mở khóa kèo")
    .addStringOption((option) =>
      option
        .setName("offer")
        .setDescription("Chọn kèo")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const myDb = await db.get(interaction.guildId);
    const choices = myDb.offers
      .filter((o) => o.locked)
      .filter((o) => !o.ended)
      .map((o) => {
        return { uid: o.uid, text: printOdds(o).replaceAll("*", "") };
      });
    const filtered = choices.filter((c) =>
      c.text.toLowerCase().includes(focusedValue.toLowerCase()),
    ).slice(0,24);
    await interaction.respond(
      filtered.map((c) => ({ name: c.text.slice(0,99), value: c.uid })),
    );
  },
  async execute(interaction) {
    const offer = interaction.options.getString("offer");
    const myDb = await db.get(interaction.guildId);
    const chosenOffer = myDb.offers.find((o) => o.uid == offer);
    //let player = myDb.players.find(p => p.userId == interaction.user.id)
    if (!chosenOffer) {
      await interaction.reply({
        content: `Không tìm thấy kèo.`,
        ephemeral: true,
      });
      return;
    }
    chosenOffer.locked = 0;
    db.set(interaction.guildId, myDb);
    await interaction.reply(
      `${interaction.user} đã thả xích kèo:\n${printOdds(chosenOffer)}\nGiờ bro đã có thể lên và rút ở kèo này.`,
    );
  },
};
