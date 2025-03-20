const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const dataFile = require("../../../data/data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Promote a user to the next rank in the ladder.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to promote")
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      await interaction.reply("You don't have the permissions for that!");
      return;
    }
    const roles = member.roles.valueOf();
    const ranks = dataFile["RANKS"];
    const rankIds = Object.values(ranks);
    const currentRole = roles.find((role) => rankIds.includes(role.id));
    if (currentRole != undefined) {
      const nextIndex =
        Number(Object.keys(ranks).find((key) => ranks[key] == currentRole.id)) +
        1;
      const nextRole = await interaction.guild.roles.fetch(ranks[nextIndex]);
      member.roles.add(nextRole);
      member.roles.remove(currentRole);
      await interaction.reply(
        `Promoted ${user.displayName} from ${currentRole.name} to ${nextRole.name}.`,
      );
    } else {
      const role = await interaction.guild.roles.fetch(ranks[0]);
      member.roles.add(role);
      await interaction.reply(`Promoted ${user.displayName} to ${role.name}.`);
    }
  },
};
