const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { getChannel } = require("../../channels.js");
const { pingRole, getRoleId } = require("../../roles.js");
const chrono = require("chrono-node");

async function setupEmojiReaction(emoji, message, fieldName) {
    const embed = message.embeds[0];
    const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot;
    const collector = message.createReactionCollector({ filter: filter, dispose: true, });
    collector.on("collect", async (reaction, user) => {
        // Get current field value for appending.
	const currentFieldValue = embed.fields.find(field => field.name == fieldName).value;
        // Check if the field corresponding to the emoji already contains the user.
	if (!currentFieldValue.includes(user.displayName)) {
            // Check if any other fields contain the user's name, if they do, remove them from that field.
	    embed.fields.forEach(field => {
		if (field.value.includes(user.displayName)) {
		    field.value = field.value.replace(`\n${user.displayName}`,"");
		}
	    });
            // Append to the field
	    const newFieldValue = `${currentFieldValue}\n${user.displayName}`;

	    const newEmbed = embed;
	    newEmbed.fields.find(field => field.name == fieldName).value = newFieldValue;
	    await message.edit({ embeds: [newEmbed] });
	}
    });
    collector.on("remove", async (reaction, user) => {
        const field = embed.fields.find(field => field.value.includes(user.displayName));
        const newValue = field.value.replace(`\n${user.displayName}`,"");
        const newEmbed = embed;
        newEmbed.fields.find(field => field.value.includes(user.displayName)).value = newValue;

        await message.edit({ embeds: [newEmbed] });
    });
};

async function checkExecutionConditions(interaction, args) { 
    if (!(args.name && args.description && args.time)) {
        await interaction.reply("You must specify all 3 arguments!");
        return false;
    }
    if (!hasModPerms(interaction.member)) {
        await interaction.reply("You don't have the correct permissions for that!");
        return false;
    }
    if (!getChannel("OPERATIONS")) {
        await interaction.reply(`You need to set the operations channel first!`);
        return false;
    }
    if (!getRoleId("OPERATOR")) {
        await interaction.reply(`You need to set the operator role first!`);
        return false;
    }

    return true;
}

function dateToZulu(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];

    const day = date.getUTCDate();
    const daySuffix = (day) => {
        if (day >= 11 && day <= 13) return "th";
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const formattedDate = `${days[date.getUTCDay()]} ${months[date.getUTCMonth()]} ${day}${daySuffix(day)} ${date.getUTCFullYear()}, ` +
                          `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} Zulu`;

    return formattedDate;
}

function checkDateValidity(date) {
    return date != NaN && date != undefined && date;
}

async function sendOperationEmbed(name, description, time, channel) {
    channel.send(pingRole("OPERATOR"));
    const operationEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Operation ${name}`)
        .addFields(
            { name: "Briefing", value: description },
            { name: "At", value: dateToZulu(time), inline: true },
            { name: "Attendance", value: "React with a checkmark if you can attend, a question mark if you might be able to attend, or an X if you can't attend." },
            { name: "Attending", value: "" },	
            { name: "Tentative", value: "" },
            { name: "Not Attending", value: "" },
        )
        .setTimestamp()

    const operationMessage = await channel.send({ embeds: [ operationEmbed ] });
    return operationMessage;
}

async function setupAttendanceEmojis(message) {
    message.react("✅");
    message.react("❓");
    message.react("❌");

    setupEmojiReaction("✅", message, "Attending");
    setupEmojiReaction("❓", message, "Tentative");
    setupEmojiReaction("❌", message, "Not Attending");
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
	let time = interaction.options.getString("time");

        // Weird await shit
        let canRun = await checkExecutionConditions(interaction, { name: name, description: description, time: time });
	if (!canRun)
            return;

        // Now that we've verified the presence of a 'time' argument, we can parse it.
        time = chrono.parseDate(time);

        // But it still might be invalid.
        if (!checkDateValidity(time)) {
            await interaction.reply("Invalid time supplied.");
            return;
        }

	const channel = await interaction.client.channels.fetch(getChannel("OPERATIONS"));

        const operationMessage = await sendOperationEmbed(name, description, time, channel);
        await setupAttendanceEmojis(operationMessage);

	await interaction.reply(`<@${interaction.user.id}> created operation ${name} for ${time}`);
    },
};
