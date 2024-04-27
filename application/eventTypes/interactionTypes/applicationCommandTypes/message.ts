// Type imports
import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedApplicationCommandType,
    SavedMessageCommand,
} from "../../../../declarations/types";

/**
 * Message command handler
 */
export const messageCommandInteraction: SavedApplicationCommandType = {
    type: ApplicationCommandType.Message,

    async execute(interaction: MessageContextMenuCommandInteraction) {
        /**
         * Message command that was interacted with
         */
        const messageCommand = applicationCommands.get(
            interaction.commandName + `(${this.type})`,
        ) as SavedMessageCommand | undefined;

        // Check if message command was found
        if (messageCommand) {
            // Try to forward message command interaction response prompt
            await messageCommand.execute(interaction).catch(async (error) => {
                // Send notifications
                sendNotification(
                    {
                        consoleOutput: `Error handling interaction with message command '${interaction.commandName}'`,
                        content: `There was an error handling the interaction with the message command \`\`${interaction.commandName}\`\`!`,
                        error,
                        interaction,
                        owner: interaction.client.application.owner,
                        type: "error",
                    },
                    {
                        content:
                            PredefinedInteractionErrorResponse.errorHandlingInteraction,
                        interaction,
                    },
                );
                // TODO: Interaction Error Response
            });
        } else {
            sendNotification({
                consoleOutput: `No file found for message command '${interaction.commandName}'`,
                content: `The file handling the message command '${interaction.commandName}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
