const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { setOperationChannel } = require("../../channels.js");

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("set-operation-channel")
	  .setDescription("Set the operations channel")
	  .addChannelOption(option =>
		  option
		    .setName("channel")
		    .setDescription("The channel for operations")
		    .addChannelTypes(ChannelType.GuildText)
		    .setRequired(true)),
    async execute(interaction) {
	const channel = interaction.options.getChannel("channel");
	if (!hasModPerms(interaction.member)) {
		await interaction.reply("You don't have the correct permissions for that!");
		return;
	}
	
	setOperationChannel(channel);
	
	await interaction.reply(`Set ${channel.name} to operations channel.`);
    },
};
