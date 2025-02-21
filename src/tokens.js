const tokensFile = require("../data/data.json");
const fs = require("fs");

const writeTokensFile = () => { fs.writeFileSync("data/data.json", JSON.stringify(tokensFile, null, 2), "utf8", err => { if (err) throw err; }); };

const getUserTokens = (member) => {
    const memberUsername = member.username;
    if (!tokensFile.TOKENS) {
	createTokensFile();
    }

    if (!tokensFile.TOKENS[memberUsername]) {
	setUserTokens(member, 0);
	return 0;
    }

    return Number(tokensFile.TOKENS[memberUsername]);
};

const createTokensFile = () => {
    tokensFile.TOKENS = {};
    fs.writeFileSync("data/data.json", JSON.stringify(tokensFile, null, 2), "utf8", err => { if (err) throw err; }); 
};

const setUserTokens = (member, tokens) => {
    tokensFile.TOKENS[member.username] = Number(tokens);
    fs.writeFileSync("data/data.json", JSON.stringify(tokensFile, null, 2), "utf8", err => { if (err) throw err; }); 
};

const addUserTokens = (member, amount) => {
    setUserTokens(member, (Number(getUserTokens(member)) + Number(amount)));
};

exports.getUserTokens = getUserTokens;
exports.setUserTokens = setUserTokens;
exports.addUserTokens = addUserTokens;
