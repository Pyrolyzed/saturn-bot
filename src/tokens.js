const tokensFile = require("../data/data.json");
const fs = require("fs");

const getUserTokens = (member) => {
    const memberUsername = member.username;
    if (!tokensFile[memberUsername]) {
	setUserTokens(member, 0);
	return 0;
    }

    return Number(tokensFile[memberUsername]);
};

const setUserTokens = (member, tokens) => {
    tokensFile[member.username] = Number(tokens);
    fs.writeFileSync("data/tokens.json", JSON.stringify(tokensFile, null, 2), "utf8", err => { if (err) throw err; });
};

const addUserTokens = (member, amount) => {
    setUserTokens(member, (Number(getUserTokens(member)) + Number(amount)));
};

exports.getUserTokens = getUserTokens;
exports.setUserTokens = setUserTokens;
exports.addUserTokens = addUserTokens;

