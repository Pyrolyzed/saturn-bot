const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { saveDataFile } = require("../../utils.js");
const dataFile = require("../../../data/data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-rank")
    .setDescription("Add a rank to the rank ladder.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role of the rank")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("index")
        .setDescription("The index on the ladder of the rank"),
    ),
  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      await interaction.reply("You don't have the permissions for that!");
      return;
    }
    const index =
      interaction.options.getNumber("index") ??
      Object.keys(dataFile["RANKS"]).length;
    const displayIndex = index + 1; // User displayed index.

    dataFile["RANKS"][index] = role.id;
    saveDataFile();
    await interaction.reply(
      `Role ${role.name} is now at index ${displayIndex} on the ladder.`,
    );
  },
};
