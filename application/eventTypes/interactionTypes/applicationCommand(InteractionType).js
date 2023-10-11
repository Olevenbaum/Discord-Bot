// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, InteractionType } = require("discord.js");

// Creating application commands types collection
const applicationCommandTypes = new Collection();

// Defining application command types path
const applicationCommandTypesPath = path.join(
    __dirname,
    "./applicationCommandTypes"
);

// Reading application command type filenames
const applicationCommandTypeFiles = fs
    .readdirSync(applicationCommandTypesPath)
    .filter((applicationCommandTypeFile) =>
        applicationCommandTypeFile.endsWith(".js")
    );

// Iterating over application command types
applicationCommandTypeFiles.forEach((applicationCommandTypeFile) => {
    // Reading application command type
    const applicationCommandType = require(path.join(
        applicationCommandTypesPath,
        applicationCommandTypeFile
    ));

    // Cecking required parts of application command type
    if ("execute" in applicationCommandType) {
        // Adding application command type to it's collection
        applicationCommandTypes.set(
            applicationCommandType.type,
            applicationCommandType
        );
    } else {
        // Printing warning
        console.warn(
            "[WARNING]:",
            `Missing required 'execute' property of application command type '${applicationCommandTypeFile.type}'`
        );

        // Printing information
        console.info(
            "[INFORMATION]:",
            `The application command type file for the application command type '${applicationCommandType.name}' is incomplete and thereby was not added`
        );
    }
});

module.exports = {
    // Setting interaction type
    type: InteractionType.ApplicationCommand,

    // Handling interaction
    async execute(interaction) {
        // Searching for application command type
        const applicationCommandType = applicationCommandTypes.get(
            interaction.commandType
        );

        // Checking if application command type was found
        if (applicationCommandType) {
            // Trying to execute application command type specific script
            await applicationCommandType.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]:", error);
            });
        } else {
            // Printing error
            console.error(
                "[ERROR]:",
                `No application command type file for application command type '${interaction.commandType}' was found`
            );
        }
    },
};
