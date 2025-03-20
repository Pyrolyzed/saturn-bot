const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dataFile = require("../../../data/data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-ranks")
    .setDescription("View the ranks on the rank ladder"),
  async execute(interaction) {
    const ranks = dataFile["RANKS"];
    let rankFieldValue = "";
    let roles = await interaction.guild.roles.fetch();
    // This isn't the way I wanted to write this, but the nice way for some reason wouldn't ever work. apparently find() just doesn't fucking work because fuck me I guess.
    Object.keys(ranks).forEach((index) => {
      roles.forEach((role) => {
        if (role.id == ranks[index]) {
          rankFieldValue += `\n${index}. ${role.name}`;
        }
      });
    });
    const messageEmbed = new EmbedBuilder().setTitle("Rank Ladder").addFields({
      name: "Ranks",
      value: rankFieldValue,
    });
    await interaction.reply({ embeds: [messageEmbed] });
  },
};
