const { SlashCommandBuilder } = require("discord.js");
const { saveDataFile } = require("../../utils.js");
const dataFile = require("../../../data/data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-rank")
    .setDescription("Remove a rank from the rank ladder.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role of the rank")
        .setRequired(true),
    ),
  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      await interaction.reply("You don't have the permissions for that!");
      return;
    }
    const ranks = dataFile["RANKS"];
    const index = -1;
    for (i = 0; i < Object.keys(ranks).length; i++) {
      if (ranks[i] == role.id) {
        index = ranks[i];
        saveDataFile();
      }
    }
    if (index == -1)
      await interaction.reply(`Role ${role.name} is not on the ladder.`);
    else
      await interaction.reply(
        `Role ${role.name} has been removed from the rank ladder.`,
      );
  },
};
