const channelsFile = require("../data/data.json");
const fs = require("fs");

const getOperationChannel = () => channelsFile["OPERATIONS"];

const setOperationChannel = (channel) => {
    channelsFile["OPERATIONS"] = channel.id
    fs.writeFileSync("data/data.json", JSON.stringify(channelsFile, null, 2), "utf8", err => { if (err) throw err; });
};

exports.setOperationChannel = setOperationChannel;
exports.getOperationChannel = getOperationChannel;
