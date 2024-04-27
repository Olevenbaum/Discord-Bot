// Type imports
import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedApplicationCommandType,
    SavedChatInputCommand,
} from "../../../../declarations/types";

/**
 * Chat input command handler
 */
export const chatInputCommandInteraction: SavedApplicationCommandType = {
    type: ApplicationCommandType.ChatInput,

    async execute(interaction: ChatInputCommandInteraction) {
        /**
         * Chat input command that was interacted with
         */
        const chatInputCommand = applicationCommands.get(
            interaction.commandName + `(${this.type})`,
        ) as SavedChatInputCommand | undefined;

        // Check if chat input command was found
        if (chatInputCommand) {
            // Try to forward chat input command interaction response prompt
            await chatInputCommand
                .execute(interaction)
                .catch(async (error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with chat input command '${interaction.commandName}'`,
                            content: `There was an error handling the interaction with the chat input command \`\`${interaction.commandName}\`\`!`,
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
                consoleOutput: `No file found for chat input command '${interaction.commandName}'`,
                content: `The file handling the chat input command '${interaction.commandName}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
