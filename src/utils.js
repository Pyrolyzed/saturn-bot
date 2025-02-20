const { PermissionsBitField } = require("discord.js");

const hasModPerms = (member) => {
    return member.permissions.has(PermissionsBitField.Flags.ManageGuild);
};


exports.hasModPerms = hasModPerms;
