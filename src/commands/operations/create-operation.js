const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { hasModPerms } = require("../../utils.js");
const { getChannel } = require("../../channels.js");
const { pingRole, getRoleId } = require("../../roles.js");
const chrono = require("chrono-node");

// TODO: Move these to an embed utils file

function editFieldName(newName, message, embed, field) {
    const newEmbed = embed;
    findField(field, newEmbed).name = newName;
    message.edit({ embeds: [newEmbed] });
    return field;
}

function findFieldByContents(contents, embed) {
    return embed.fields.find(field => field.value.includes(contents));
}

function findField(findField, embed) {
    return embed.fields.find(field => field.value == findField.value);
}

function findFieldByName(name, embed) {
    return embed.fields.find(field => field.name == name);
}

function editField(value, message, field) {
    const embed = message.embeds[0];

    findField(field, embed).value = value;
    message.edit({ embeds: [embed] });

    return field;
}

function replaceInField(filter, replacement, message, field) {
    editField(field.value.replace(filter, replacement), message, field);
    return field;
}

function appendToField(value, message, field, newLine = true) {
    if (newLine && field.value != "") {
        editField(`${field.value}\n${value}`, message, field);
    } else {
        editField(`${field.value}${value}`, message, field);
    }
    return field;
}

function setupEmojiReaction(emoji, message, fieldName) {
    const embed = message.embeds[0];
    const filter = (reaction, user) => reaction.emoji.name === emoji && !user.bot;
    const collector = message.createReactionCollector({ filter: filter, dispose: true, });
    
    collector.on("collect", async (reaction, user) => {
        let field = findFieldByName(fieldName, embed);
	if (!field.value.includes(user.displayName)) {
            if (findFieldByContents(user.displayName, embed))
                replaceInField(`\n${user.displayName}`, "", message, findFieldByContents(user.displayName, embed));

            field = appendToField(user.displayName, message, field);
            field = editFieldName(`${fieldName.replace(/\([0-9+]\)/i, "")} (${reaction.count - 1})`, message, embed, field);
            fieldName = `${fieldName} (${reaction.count - 1})`;
	}
    });

    collector.on("remove", async (reaction, user) => {
        let field = findFieldByContents(user.displayName, embed);
        field = replaceInField(`${user.displayName}`, "", message, field);
        field = editFieldName(`${fieldName.replace(/\([0-9+]\)/i, "")} (${reaction.count - 1})`, message, embed, field);
        fieldName = `${fieldName} (${reaction.count - 1})`;
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

function checkDateValidity(date) {
    return date != NaN && date != undefined && date;
}

async function sendOperationEmbed(name, description, time, channel) {
    const epochTime = String((Number(new Date(time).valueOf()) / 1000));
    channel.send(pingRole("OPERATOR"));
    const operationEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Operation ${name}`)
        .addFields(
            { name: "Briefing", value: description },
            { name: "Time", value: `<t:${epochTime}:F>\n<t:${epochTime}:R>` },
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
