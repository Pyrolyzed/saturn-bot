const rolesFile = require("../data/data.json");
const fs = require("fs");

const setRole = (role, roleKey) => {
    rolesFile[roleKey.toUpperCase()] = role.id;
    fs.writeFileSync("data/data.json", JSON.stringify(rolesFile, null, 2), "utf8", err => { if (err) throw err; });
};

const getRoleId = (roleKey) => {
    if (rolesFile[roleKey.toUpperCase()] == undefined) {
	console.log(`Could not find role with ID ${roleKey.toUpperCase()}.`);
    }
    return rolesFile[roleKey.toUpperCase()]
};

const pingRole = (roleKey) => {
    return `<@&${getRoleId(roleKey)}>`;
};

exports.setRole = setRole;
exports.getRoleId = getRoleId;
exports.pingRole = pingRole;
