// Type imports
import { InteractionType, ModalSubmitInteraction } from "discord.js";
import {
    PredefinedInteractionErrorResponse,
    SavedInteractionType,
} from "../../../declarations/types";

/**
 * Modal submit interaction handler
 */
export const modalSubmitInteraction: SavedInteractionType = {
    type: InteractionType.ModalSubmit,

    async execute(interaction: ModalSubmitInteraction) {
        /**
         * Modal that was submitted
         */
        const modal = modals.get(interaction.customId);

        // Check if modal was found
        if (modal) {
            // Try to forward modal submit interaction response prompt
            await modal.execute(interaction).catch((error: Error) => {
                // Send notifications
                sendNotification(
                    {
                        consoleOutput: `Error handling submission of modal '${interaction.customId}'`,
                        content: `The submission of the modal \`\`${interaction.customId}\`\` could not be handled!`,
                        error,
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
                consoleOutput: `No file found for modal '${interaction.customId}'`,
                content: `The file handling the modal '${interaction.customId}' does not exist!`,
                interaction,
                owner: interaction.client.application.owner,
                type: "error",
            });
            // TODO: Interaction Error Response
        }
    },
};
