const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { db } = require("../db");
const {
  printOdds,
  printAllBet,
  betGroupToReturn,
  betGroupToReturnRatio,
} = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Thông báo kèo")
    .addStringOption((option) =>
      option
        .setName("offer")
        .setDescription("Chọn kèo")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("result")
        .setDescription("Kết quả")
        .setRequired(true)
        .addChoices(
          { name: "Lựa chọn 1", value: "team1win" },
          { name: "Lựa chọn 2", value: "team2win" },
          { name: "Hòa", value: "draw" },
        ),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const myDb = await db.get(interaction.guildId);
    const choices = myDb.offers
    .filter(o => !o.ended)
    .map((o) => {
      return { uid: o.uid, text: printOdds(o).replaceAll("*", "").slice(0, 99) };
    });
    const filtered = choices.filter((c) =>
      c.text.toLowerCase().includes(focusedValue.toLowerCase()),
    ).slice(0,24);
    await interaction.respond(
      filtered.map((c) => ({ name: c.text, value: c.uid })),
    );
  },
  async execute(interaction) {
    const offer = interaction.options.getString("offer");
    const result = interaction.options.getString("result");
    const myDb = await db.get(interaction.guildId);
    const chosenOffer = myDb.offers.find((o) => o.uid == offer);
    const affectedPlayerBetgroup = []; // player, betgroup, successNow

    const payout = (player, betgroup) => {
      const prize = betGroupToReturn(betgroup, myDb);
      player.balance += prize;
      player.balance = Math.round(player.balance * 10) / 10;
      interaction.channel.send(
        `<@${player.userId}> **đã ăn ${prize} 💵**! (${Math.round(betGroupToReturnRatio(betgroup, myDb) * 10) / 10}x)`,
      );
    };

    if (!chosenOffer) {
      await interaction.reply({
        content: `Không tìm thấy kèo.`,
        ephemeral: true,
      });
      return;
    }

    myDb.players.forEach((p) => {
      p.bets.forEach((betgroup) => {
        const betOfThisOffer = betgroup.combination.find(
          (b) => b.offerUid == offer,
        );
        if (betOfThisOffer) {
          if (betOfThisOffer.chosenOpt == result) {
            betOfThisOffer.success = true;
            affectedPlayerBetgroup.push({
              player: p,
              betgroup: betgroup,
              successNow: true,
            });
            if (!betgroup.combination.some((b) => b.success === undefined)) {
              // if all success
              payout(p, betgroup);
              p.bets = p.bets.filter(
                (_betgroup) => _betgroup.uid != betgroup.uid,
              );
            }
          } else {
            betOfThisOffer.success = false;
            affectedPlayerBetgroup.push({
              player: p,
              betgroup: betgroup,
              successNow: false,
            });
            p.bets = p.bets.filter(
              (_betgroup) => _betgroup.uid != betgroup.uid,
            );
          }
        }
      });
    });
    toChosenString = {
      team1win: chosenOffer["team1name"],
      team2win: chosenOffer["team2name"],
      draw: "Hòa",
    };
    const playerResults = affectedPlayerBetgroup
      .sort(
        (a, b) =>
          b.betgroup.combination.filter((bb) => bb.success).length -
          a.betgroup.combination.filter((bb) => bb.success).length,
      )
      .map((w) => {
        return `${interaction.guild.members.cache.get(w.player.userId)}\n${printAllBet(w.betgroup, myDb)}${w.successNow ? "" : "❌"}`;
      })
      .join("\n─────────────────────────────\n");
    chosenOffer.ended = true
    db.set(interaction.guildId, myDb);
    await interaction.reply(
      `${interaction.user} đã thông báo kết quả của kèo:\n${printOdds(chosenOffer)}\nKết quả: **${toChosenString[result]}**\n\nKết quả của các con nghiện:\n${playerResults}`.slice(0,1999),
    );
  },
};
