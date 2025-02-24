const { PermissionsBitField } = require("discord.js");

const saveDataFile = () => {
    fs.writeFileSync("data/data.json", JSON.stringify(channelsFile, null, 2), "utf8", err => { if (err) throw err; });
};

const hasModPerms = (member) => {
    return member.permissions.has(PermissionsBitField.Flags.ManageGuild);
};

const getDate = (date) => {
    let parsedDate = new Date(date + " UTC");

    if (Date.now() > parsedDate)
	return new Date(Date.now() + 4 * 60 * 60 * 1000);

    return parsedDate;
};

exports.saveDataFile = saveDataFile;
exports.hasModPerms = hasModPerms;
exports.getDate = getDate;
