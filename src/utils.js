const { PermissionsBitField } = require("discord.js");
const fs = require("fs");
const dataFile = require("../data/data.json");

const saveDataFile = () => {
  fs.writeFileSync(
    "data/data.json",
    JSON.stringify(dataFile, null, 2),
    "utf8",
    (err) => {
      if (err) throw err;
    },
  );
};

const hasModPerms = (member) => {
  return member.permissions.has(PermissionsBitField.Flags.ManageGuild);
};

const getDate = (date) => {
  let parsedDate = new Date(date + " UTC");

  if (Date.now() > parsedDate) return new Date(Date.now() + 4 * 60 * 60 * 1000); // Return 4 hours from now if the supplied date is in the past.

  return parsedDate;
};

module.exports = {
  saveDataFile: saveDataFile,
  hasModPerms: hasModPerms,
  getDate: getDate,
};
