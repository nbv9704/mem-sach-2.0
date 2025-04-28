const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");
const { printOffers } = require("../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("offers")
    .setDescription("Hiện tất tất cả các kèo"),
  async execute(interaction) {
    const myDb = await db.get(interaction.guildId);
    if (myDb.offers?.filter((o) => !o.ended).length > 0) {
      const printArray = printOffers(myDb.offers)
      let toReply = `Những kèo hiện tại:\n${printArray[0]}`

      await interaction.reply(toReply);
      for (let i = 1; i < printArray.length; i++) {
        await interaction.channel.send(printArray[i])
      }
    } else {
      await interaction.reply(
        `Không có kèo nào hiện tại.\nĐợi admin thêm kèo đi, bớt nghiện lại đi :3`,
      );
    }
  },
};
