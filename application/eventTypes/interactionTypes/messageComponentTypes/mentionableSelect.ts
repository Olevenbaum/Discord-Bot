// Type imports
import { ComponentType, MentionableSelectMenuInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedMentionableSelectComponent,
    SavedMessageComponentType,
} from "../../../../declarations/types";

/**
 * Mentionable select component interaction handler
 */
export const mentionableSelectComponentInteraction: SavedMessageComponentType =
    {
        type: ComponentType.MentionableSelect,

        async execute(interaction: MentionableSelectMenuInteraction) {
            /**
             * Mentionable select component that was interacted with
             */
            const mentionableSelectComponent = components.get(
                interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
            ) as SavedMentionableSelectComponent | undefined;

            // Check if mentionable select component was found
            if (mentionableSelectComponent) {
                // Try to forward mentionable select component interaction response prompt
                await mentionableSelectComponent
                    .execute(interaction)
                    .catch((error: Error) => {
                        // Send notifications
                        sendNotification(
                            {
                                consoleOutput: `Error handling interaction with mentionable select component '${interaction.customId}'`,
                                content: `There was an error handling the interaction with the mentionable select component \`\`${interaction.customId}\`\`!`,
                                error: error,
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
                    consoleOutput: `No file found for mentionable select component '${interaction.customId}'`,
                    content: `The file handling the mentionable select component '${interaction.customId}' does not exist!`,
                    interaction,
                    owner: interaction.client.application.owner,
                    type: "error",
                });
                // TODO: Interaction Error Response
            }
        },
    };
