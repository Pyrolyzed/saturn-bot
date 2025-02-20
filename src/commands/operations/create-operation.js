const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { getOperationChannel } = require("../../channels.js");

module.exports = {
    data: new SlashCommandBuilder()
	.setName("create-operation")
	.setDescription("Create an operation")
        .addStringOption(option =>
	    option
		.setname("name")
	        .setdescription("The name of the operation"))
        .addStringOption(option =>
	    option
		.setname("description")
	        .setdescription("The description of the operation"))
        .addStringOption(option =>
	    option
		.setname("time")
	        .setdescription("The time of the operation")), 
    async execute(interaction) {
	const name = interaction.options.getString("name");
	const description = interaction.options.getString("description");
	const time = interaction.options.getString("time");
	if (!hasModPerms(interaction.member)) {
		await interaction.reply("You don't have the correct permissions for that!");
		return;
	}

	const operationEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
	    .setTitle(`Operation ${name}`)
	    .addFields(
		{ name: "Briefing", value: description },
		{ name: "\u200B", value: "\u200B" }, // new line
		{ name: "At:", value: time },
	    )
	    .setTimestamp()

	getOperationChannel().send({ embeds: [ operationEmbed ] });

	await interaction.reply(`${interaction.user.tag} created operation ${name} for ${time}`);
    },
};
