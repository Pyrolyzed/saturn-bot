const { SlashCommandBuilder } = require("discord.js");
const { getUserTokens } = require("../../tokens.js");
const tokensFile = require("../../../data/tokens.json");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("list-tokens")
	  .setDescription("List the 10 users with the most rank tokens."),
    async execute(interaction) {
	let sorted = Object.entries(tokensFile).sort((a, b) => { return b - a; }).reduce((sort, [key, value]) => {
	    sort[key] = value;
	    return sort;
	}, {});
        let message = "";
	Object.keys(sorted).forEach(key => {
	    message = message + `${key}: ${sorted[key]} rank tokens \n`;
	});
	await interaction.reply(message);
    },
};
