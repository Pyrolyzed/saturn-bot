const channelsFile = require("../data/channels.json");
const fs = require("fs");

const getOperationChannel = () => {
    return channelsFile["OPERATIONS"];
};

const setOperationChannel = (channel) => {
    channelsFile["OPERATIONS"] = channel.id
    fs.writeFileSync("data/channels.json", JSON.stringify(channelsFile, null, 2), "utf8", err => { if (err) throw err; });
};

exports.setOperationChannel = setOperationChannel;
exports.getOperationChannel = getOperationChannel;
