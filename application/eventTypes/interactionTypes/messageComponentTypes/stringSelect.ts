// Type imports
import { ComponentType, StringSelectMenuInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedMessageComponentType,
    SavedStringSelectComponent,
} from "../../../../declarations/types";

/**
 * String select component interaction handler
 */
export const stringSelectComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.StringSelect,

    async execute(interaction: StringSelectMenuInteraction) {
        /**
         * String select component that was interacted with
         */
        const stringSelectComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedStringSelectComponent | undefined;

        // Check if string select component was found
        if (stringSelectComponent) {
            // Try to forward string select component interaction response prompt
            await stringSelectComponent
                .execute(interaction)
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with string select component '${interaction.customId}'`,
                            content: `There was an error handling the interaction with the string select component \`\`${interaction.customId}\`\`!`,
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
                consoleOutput: `No file found for string select component '${interaction.customId}'`,
                content: `The file handling the string select component '${interaction.customId}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
