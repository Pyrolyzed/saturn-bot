const { SlashCommandBuilder } = require("discord.js");
const { tokens } = require("../../tokens.js");

module.exports = {
	// TODO add arguments
	data: new SlashCommandBuilder()
	      .setName("rank-tokens get")
	      .setDescription("Gets the rank tokens of a user."),
	async execute(interaction) {
              // ${tokens.rankTokens[interaction.member]}
	      await interaction.reply(`You have ${tokens["test"]} tokens.`);
	},
};
