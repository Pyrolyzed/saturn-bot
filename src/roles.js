const rolesFile = require("../data/data.json");
const fs = require("fs");

const pingOperator = () => `<@&${getOperatorRole()}>`;

const setOperatorRole = (role) => {
    rolesFile["OPERATOR"] = role.id;
    fs.writeFileSync("data/data.json", JSON.stringify(rolesFile, null, 2), "utf8", err => { if (err) throw err; });
};

const getOperatorRole = () => rolesFile["OPERATOR"];


exports.pingOperator = pingOperator;
exports.setOperatorRole = setOperatorRole;
exports.getOperatorRole = getOperatorRole;
