const { SlashCommandBuilder } = require("discord.js");
const { hasModPerms, saveDataFile } = require("../../utils.js");
const json = require("../../../data/data.json");

function checkTimeZoneValidity(zone) {
    try {
        new Intl.DateTimeFormat(undefined, { zone });
        return true;
    } catch (e) {
        return false;
    }
}

function setTimeZone(timeZone) {
    if (!checkTimeZoneValidity(timeZone))
        return;

    json["TIMEZONE"] = timeZone;
    saveDataFile();
}

module.exports = {
    data: new SlashCommandBuilder()
	  .setName("set-operation-channel")
	  .setDescription("Set the operations channel")
	  .addStringOption(option =>
		  option
		    .setName("timezone")
		    .setDescription("The timezone to set for operation dates.")
		    .setRequired(true)),
    async execute(interaction) {
        const zone = interaction.getStringOption("timezone");

	if (!hasModPerms(interaction.member)) {
            await interaction.reply("You don't have the correct permissions for that!");
            return;
	}

        setTimeZone(zone);
	
	await interaction.reply(`Set ${zone} to operations timezone.`);
    },
};
