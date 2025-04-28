const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const { printOdds } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deleteoffer")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("[PREIUM] Xóa kèo")
    .addStringOption((option) =>
      option
        .setName("offer")
        .setDescription("Chọn kèo")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const myDb = (await db.get(interaction.guildId)) || {
      offers: [],
      players: [],
    };
    const choices = myDb.offers
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
    const myDb = (await db.get(interaction.guildId)) || {
      offers: [],
      players: [],
    };
    const toDelete = myDb.offers
      .filter((o) => !o.ended)
      .find((o) => o.uid == offer);
    myDb.players.forEach((p) => {
      const betgroupsWithDeleted = p.bets
        .filter((betgroup) =>
          betgroup.combination.some((b) => b.offerUid == offer),
        )

      const ret = betgroupsWithDeleted
        .map((b) => b.amount)
        .reduce((a, v) => a + v, 0);
      p.balance += ret;
      p.balance = Math.round(p.balance*10)/10
      p.bets = p.bets.filter((betgroup) =>
          !betgroup.combination.some((b) => b.offerUid == offer))

      if (ret > 0) {
        interaction.channel.send(
          `Kèo của con nghiện <@${p.userId}>:\n${printOdds(toDelete)} vừa nhót (đã hoàn lại ${ret} 💵)`,
        );
      }
    });
    toDelete.ended = true;
    db.set(interaction.guildId, myDb);
    await interaction.reply(`Đã xóa kèo:\n${printOdds(toDelete)}`);
  },
};
