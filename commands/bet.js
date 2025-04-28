const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");
const { printOdds, getOrCreatePlayer } = require("../utils");
const { uid } = require("uid/secure");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Vào chòng")
    .addStringOption((option) =>
      option
        .setName("offer")
        .setDescription("Chọn kèo")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Chọn lựa")
        .setRequired(true)
        .addChoices(
          { name: "Lựa chọn 1", value: "team1win" },
          { name: "Lựa chọn 2", value: "team2win" },
          { name: "Hòa", value: "draw" },
        ),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Số 💵")
        .setMinValue(1)
        .setRequired(true),
    ),
  async autocomplete(interaction) {
    const field = interaction.options.getFocused(true);
    const myDb = await db.get(interaction.guildId);
    const choices = myDb.offers
      .filter((o) => !o.locked)
      .filter((o) => !o.ended)
      .map((o) => {
        return { uid: o.uid, text: printOdds(o).replaceAll("*", "") };
      });
    const filtered = choices.filter((c) =>
      c.text.toLowerCase().includes(field.value.toLowerCase())
    ).slice(0, 24);
    await interaction.respond(
      filtered.map((c) => ({ name: c.text.slice(0,99), value: c.uid })),
    );
    return;
  },
  async execute(interaction) {
    const offer = interaction.options.getString("offer");
    const amount = interaction.options.getInteger("amount");
    const choice = interaction.options.getString("choice");
    const myDb = await db.get(interaction.guildId);
    const chosenOffer = myDb.offers.find((o) => o.uid == offer);
    const player = await getOrCreatePlayer(interaction, myDb);
    if (!chosenOffer) {
      await interaction.reply({
        content: `Không thấy kèo.`,
        ephemeral: true,
      });
      return;
    }
    if (chosenOffer.locked) {
      await interaction.reply({
        content: `Kèo này đã bị khóa.`,
        ephemeral: true,
      });
      return;
    }
    if (chosenOffer.ended) {
      await interaction.reply({
        content: `Kèo này đã chấm hết.`,
        ephemeral: true,
      });
      return;
    }
    if (player.balance < amount) {
      await interaction.reply({
        content: `Bạn quá nghèo để vào ${amount} 💵.\nTài sản của bạn còn mỗi ${player.balance} 💵.`,
        ephemeral: true,
      });
      return;
    }
    toRetKey = { team1win: "team1ret", team2win: "team2ret", draw: "drawret" };
    toChosenString = {
      team1win: chosenOffer["team1name"],
      team2win: chosenOffer["team2name"],
      draw: "Hòa",
    };
    if (!chosenOffer[toRetKey[choice]]) {
      await interaction.reply({
        content: `Ai cho bạn vào kèo này ?`,
        ephemeral: true,
      });
      return;
    }
    player.balance -= amount;
    player.bets.push({
      amount,
      uid: uid(),
      combination: [
        {
          offerUid: chosenOffer.uid,
          chosenOpt: choice,
        },
      ],
    });
    db.set(interaction.guildId, myDb);
    const possibleReturn =
      Math.round(chosenOffer[toRetKey[choice]] * amount * 10) / 10;
    await interaction.reply(
      `${interaction.user} đã đặt **${amount} 💵** vào kèo:\n${printOdds(chosenOffer)}\nLựa chọn: **${toChosenString[choice]}**\nCÓ THỂ ăn được: **${possibleReturn} 💵**`,
    );
  },
};
