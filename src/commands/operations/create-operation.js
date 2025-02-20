const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { getOperationChannel } = require("../../channels.js");
const { pingOperator, getOperatorRole } = require("../../roles.js");

module.exports = {
    data: new SlashCommandBuilder()
	.setName("create-operation")
	.setDescription("Create an operation")
        .addStringOption(option =>
	    option
		.setName("name")
	        .setDescription("The name of the operation"))
        .addStringOption(option =>
	    option
		.setName("description")
	        .setDescription("The description of the operation"))
        .addStringOption(option =>
	    option
		.setName("time")
	        .setDescription("The time of the operation")), 
    async execute(interaction) {
	const name = interaction.options.getString("name");
	const description = interaction.options.getString("description");
	const time = interaction.options.getString("time");
	if (!(name && description && time))
	    return;
	if (!hasModPerms(interaction.member)) {
	    await interaction.reply("You don't have the correct permissions for that!");
	    return;
	}
	if (!getOperationChannel()) {
	    await interaction.reply(`You need to set the operations channel first!`);
	    return;
	}
	if (!getOperatorRole()) {
	    await interaction.reply(`You need to set the operator role first!`);
	    return;
	}
	const channel = await interaction.client.channels.fetch(getOperationChannel());
	channel.send(pingOperator());
	const operationEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
	    .setTitle(`Operation ${name}`)
	    .addFields(
		{ name: "Briefing", value: description },
		{ name: "At:", value: time, inline: true },
		{ name: "Attendance", value: "React with a checkmark if you can attend, a question mark if you might be able to attend, or an X if you can't attend." },
	    )
	    .setTimestamp()

	const operationMessage = await channel.send({ embeds: [ operationEmbed ] });
	operationMessage.react("✅");
	operationMessage.react("❓");
	operationMessage.react("❌");
	
	await interaction.reply(`${interaction.user.tag} created operation ${name} for ${time}`);
    },
};
