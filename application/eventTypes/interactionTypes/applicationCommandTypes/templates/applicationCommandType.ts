// Type imports
import { ApplicationCommandType } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedApplicationCommandType,
} from "../../../../../declarations/types";

/**
 * Template for application command type handler
 */
export const applicationCommandTypeInteraction: SavedApplicationCommandType = {
    type:
        ApplicationCommandType.ChatInput ||
        ApplicationCommandType.Message ||
        ApplicationCommandType.User,

    async execute(interaction) {
        /**
         * Application command that was interacted with
         */
        const applicationCommand = applicationCommands.get(
            interaction.commandName + `(${this.type})`,
        );

        // Check if application command was found
        if (applicationCommand) {
            // Try to forward application command interaction response prompt
            await applicationCommand
                .execute(interaction)
                .catch(async (error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with application command '${interaction.commandName}'`,
                            content: `There was an error handling the interaction with the application command \`\`${interaction.commandName}\`\`!`,
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
                consoleOutput: `No file found for application command '${interaction.commandName}'`,
                content: `The file handling the application command '${interaction.commandName}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
