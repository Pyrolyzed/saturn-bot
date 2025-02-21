const { SlashCommandBuilder, EmbedBuilder, GuildScheduledEventEntityType } = require("discord.js");
const { hasModPerms, getDate } = require("../../utils.js");
const { getChannel } = require("../../channels.js");
const { pingRole, getRoleId } = require("../../roles.js");

const setupEmojiReaction = async (emoji, message, fieldName) => {
    const embed = message.embeds[0];
    const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot;
    const collector = message.createReactionCollector({ filter, });
    collector.on("collect", async (reaction, user) => {
	const currentFieldValue = embed.fields.find(field => field.name == fieldName).value;
	if (!currentFieldValue.includes(user.displayName)) {
	    embed.fields.forEach(field => {
		if (field.value.includes(user.displayName)) {
		    field.value = field.value.replace(`\n${user.displayName}`,"");
		}
	    });
	    const newFieldValue = `${currentFieldValue}\n${user.displayName}`;

	    const newEmbed = embed;
	    newEmbed.fields.find(field => field.name == fieldName).value = newFieldValue;
	    await message.edit({ embeds: [newEmbed] });
	}
    });
};

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
	if (!(name && description && time)) {
	    await interaction.reply("You must specify all 3 arguments!");
	    return;
	}
	if (!hasModPerms(interaction.member)) {
	    await interaction.reply("You don't have the correct permissions for that!");
	    return;
	}
	if (!getChannel("OPERATIONS")) {
	    await interaction.reply(`You need to set the operations channel first!`);
	    return;
	}
	if (!getRoleId("OPERATOR")) {
	    await interaction.reply(`You need to set the operator role first!`);
	    return;
	}
	const channel = await interaction.client.channels.fetch(getChannel("OPERATIONS"));
	channel.send(pingRole("OPERATOR"));
	const operationEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
	    .setTitle(`Operation ${name}`)
	    .addFields(
		{ name: "Briefing", value: description },
		{ name: "At", value: time, inline: true },
		{ name: "Attendance", value: "React with a checkmark if you can attend, a question mark if you might be able to attend, or an X if you can't attend." },
		{ name: "Attending", value: "" },	
		{ name: "Tentative", value: "" },
		{ name: "Not Attending", value: "" },
	    )
	    .setTimestamp()

	const operationMessage = await channel.send({ embeds: [ operationEmbed ] });
	operationMessage.react("✅");
	operationMessage.react("❓");
	operationMessage.react("❌");

	setupEmojiReaction("✅", operationMessage, "Attending");
	setupEmojiReaction("❓", operationMessage, "Tentative");
	setupEmojiReaction("❌", operationMessage, "Not Attending");

	await interaction.reply(`<@${interaction.user.id}> created operation ${name} for ${time}`);
    },
};
