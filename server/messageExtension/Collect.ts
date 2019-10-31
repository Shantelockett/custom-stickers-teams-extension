import { TurnContext, CardFactory } from "botbuilder";
import { MessagingExtensionResult } from "botbuilder-teams";
import { IMessagingExtensionMiddlewareProcessor, IMessagingExtensionActionRequest, ITaskModuleResult } from "botbuilder-teams-messagingextensions";

import * as debug from "debug";
// Initialize debug logging module
const log = debug("msteams");

/**
 * collect stickers from message
 */
export default class CollectMessageExtension implements IMessagingExtensionMiddlewareProcessor {

    public async onFetchTask(context: TurnContext, value: IMessagingExtensionActionRequest): Promise<MessagingExtensionResult | ITaskModuleResult> {
        log("onFetchTask", value);
        const imgs = [];

        const card = CardFactory.adaptiveCard(
            {
                type: "AdaptiveCard",
                body: [
                    {
                        type: "TextBlock",
                        text: "标题"
                    },
                    {
                        type: "Image",
                        url: `https://${process.env.HOSTNAME}/assets/icon.png`
                    }
                ],
                actions: [

                    {
                        type: "Action.Submit",
                        title: "删除",
                        data: {
                            action: "moreDetails",
                            id: "1234-5678"
                        }
                    },
                    {
                        type: "Action.Submit",
                        title: "确定",
                        data: {
                            id: "1234-5678"
                        }
                    },
                ],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.0"
            });

        const result: ITaskModuleResult = {
            type: "continue",
            value: {
                title: "saved",
                height: "small",
                width: "small",
                card,
            }
        };
        return Promise.resolve(result);
    }

    onSubmitAction?(context: TurnContext, value: IMessagingExtensionActionRequest): Promise<MessagingExtensionResult> {
        // Handle the Action.Submit action on the adaptive card

        log('onSubmit', value);

        const result: MessagingExtensionResult = {
            type: "message",
            text: "submitted"
        }

        return Promise.resolve({});
    }

}
