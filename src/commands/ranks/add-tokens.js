const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { addUserTokens, getUserTokens } = require("../../tokens.js");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("add-tokens")
	  .setDescription("Adds rank tokens to a user.")
	  .addStringOption(option =>
		  option
		    .setName("amount")
		    .setDescription("The amount of tokens to add.")
		    .setRequired(true))
	  .addUserOption(option =>
		  option
		    .setName("target")
		    .setDescription("The member to add tokens to.")
		    .setRequired(false)),
    async execute(interaction) {
	const amount = interaction.options.getString("amount");
	const target = interaction.options.getUser("target");
	const user = interaction.user;
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
		await interaction.reply("You don't have the correct permissions for that!");
		return;
	}
	if (!target) { 
	    addUserTokens(user, amount);
	    await interaction.reply(`Added ${amount} rank tokens to ${user.toString()}, they now have ${getUserTokens(user)} rank tokens.`);
	    return;
	}
	addUserTokens(target, amount);
	await interaction.reply(`Added ${amount} rank tokens to ${target.toString()}, they now have ${getUserTokens(target)} rank tokens.`);
    },
};
