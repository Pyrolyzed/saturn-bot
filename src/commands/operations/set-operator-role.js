const { SlashCommandBuilder } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { setRole } = require("../../roles.js");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("set-operator-role")
	  .setDescription("Set the role for operators")
	  .addRoleOption(option =>
		  option
		    .setName("role")
		    .setDescription("The operator role")
		    .setRequired(true)),
    async execute(interaction) {
	const role = interaction.options.getRole("role");
	if (!role)
	    return;

	if (!hasModPerms(interaction.member)) {
	    await interaction.reply("You don't have the correct permissions for that!");
	    return;
	}

	setRole(role, "OPERATOR");
	
	await interaction.reply(`Set ${role.name} to operator role.`);
    },
};
