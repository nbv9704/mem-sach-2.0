require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Bắt đầu load lại ${commands.length} lệnh.`);

    // Xóa tất cả lệnh cũ trước khi đăng ký lại
    console.log("Xóa các lệnh cũ (global)...");
    await rest.put(Routes.applicationCommands(clientId), { body: [] });

    if (guildId) {
      console.log("Xóa các lệnh cũ (local)...");
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    }

    // Đăng ký lệnh mới
    if (guildId) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log(`LOCAL: Đã load xong ${data.length} lệnh.`);
    } else {
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log(`GLOBAL: Đã load xong ${data.length} lệnh.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
