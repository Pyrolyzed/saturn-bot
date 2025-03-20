const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const dataFile = require("../../../data/data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("demote")
    .setDescription("Demote a user to the previous rank in the ladder.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to demote")
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
      const previousIndex =
        Number(Object.keys(ranks).find((key) => ranks[key] == currentRole.id)) -
        1;
      if (previousIndex < 0) {
        await interaction.reply("That user is already at the lowest rank!");
        return;
      }
      const previousRole = await interaction.guild.roles.fetch(
        ranks[previousIndex],
      );
      member.roles.add(previousRole);
      member.roles.remove(currentRole);
      await interaction.reply(
        `Demoted ${user.displayName} from ${currentRole.name} to ${previousRole.name}.`,
      );
    } else {
      await interaction.reply(
        `${user.displayName} doesn't have a rank on the ladder!`,
      );
    }
  },
};
