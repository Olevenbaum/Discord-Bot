// Type imports
import { ComponentType, UserSelectMenuInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedMessageComponentType,
    SavedUserSelectComponent,
} from "../../../../declarations/types";

/**
 * User select component interaction handler
 */
export const messageComponentInteraction: SavedMessageComponentType = {
    type: ComponentType.UserSelect,

    async execute(interaction: UserSelectMenuInteraction) {
        /**
         * User select component that was interacted with
         */
        const userSelectComponent = components.get(
            interaction.customId.replace(/[0-9]/g, "") + `(${this.type})`,
        ) as SavedUserSelectComponent | undefined;

        // Check if user select component wsa found
        if (userSelectComponent) {
            // Try to forward user select component interaction response prompt
            await userSelectComponent
                .execute(interaction)
                .catch((error: Error) => {
                    // Send notifications
                    sendNotification(
                        {
                            consoleOutput: `Error handling interaction with user select component '${interaction.customId}'`,
                            content: `There was an error handling the interaction with the user select component \`\`${interaction.customId}\`\`!`,
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
                consoleOutput: `No file found for user select component '${interaction.customId}'`,
                content: `The file handling the user select component '${interaction.customId}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
