const { SlashCommandBuilder } = require("discord.js");
const { addUserTokens, getUserTokens } = require("../../tokens.js");
const { hasModPerms } = require("../../utils.js");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("remove-tokens")
	  .setDescription("Removes rank tokens from a user.")
	  .addStringOption(option =>
		  option
		    .setName("amount")
		    .setDescription("The amount of tokens to remove.")
		    .setRequired(true))
	  .addUserOption(option =>
		  option
		    .setName("target")
		    .setDescription("The member to remove tokens from.")
		    .setRequired(false)),
    async execute(interaction) {
	const amount = interaction.options.getString("amount");
	const target = interaction.options.getUser("target");
	const user = interaction.user;
	if (!hasModPerms(interaction.member)) {
		await interaction.reply("You don't have the correct permissions for that!");
		return;
	}
	if (!target) { 
	    addUserTokens(user, -amount);
	    await interaction.reply(`Removed ${amount} rank tokens from ${user.toString()}, they now have ${getUserTokens(user)} rank tokens.`);
	    return;
	}
	addUserTokens(target, -amount);
	await interaction.reply(`Removed ${amount} rank tokens from ${target.toString()}, they now have ${getUserTokens(target)} rank tokens.`);
    },
};
