// Importing classes and methods
const { Events, Interaction } = require("discord.js");

module.exports = {
    // Defining event kind and type
    once: false,
    type: Events.AutoModerationRuleDelete,

    // Handling event
    /**
     * @param {Interaction} interaction
     */
    execute(interaction) {},
};
