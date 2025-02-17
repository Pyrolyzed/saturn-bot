const { SlashCommandBuilder } = require("discord.js");
const { getUserTokens } = require("../../tokens.js");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("rank-tokens")
	  .setDescription("Gets the rank tokens of a user.")
	  .addUserOption(option =>
		  option
		    .setName("target")
		    .setDescription("The member to get the tokens of")
		    .setRequired(false)),
    async execute(interaction) {
	if (!interaction.options.getUser("target")) { 
	    const userTokens = getUserTokens(interaction.user);
	    await interaction.reply(`You have ${userTokens} tokens.`);
	    return;
	}
	const userTokens = getUserTokens(interaction.options.getUser("target"));
	await interaction.reply(`${interaction.options.getUser("target").toString()} has ${userTokens} rank tokens.`);
    },
};
