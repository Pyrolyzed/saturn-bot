const channelsFile = require("../data/data.json");
const fs = require("fs");

const getChannel = (channelKey) => {
    if (channelsFile[channelKey.toUpperCase()] == undefined)
	console.log(`Could not find channel with key ${channelKey.toUpperCase()}`);
    return channelsFile[channelKey.toUpperCase()];
};

const setChannel = (channel, channelKey) => {
    channelsFile[channelKey.toUpperCase()] = channel.id;
    fs.writeFileSync("data/data.json", JSON.stringify(channelsFile, null, 2), "utf8", err => { if (err) throw err; });
};

exports.setChannel = setChannel;
exports.getChannel = getChannel;
