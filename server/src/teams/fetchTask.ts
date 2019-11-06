import * as debug from "debug";
import { TurnContext, CardFactory, CardImage, MessagingExtensionAttachment, TaskModuleResponse, MessagingExtensionAction, MessageActionsPayloadAttachment, TaskModuleContinueResponse } from "botbuilder";
import { addUserStickers } from "../services/sticker";
import { getUserId } from "../util";
import { Strings } from "../locale";

// Initialize debug logging module
const log = debug("collect");

interface Img { src: string; alt?: string; }
// 字符串中提取图片信息
function getImages(text: string): Img[] {
    const urls: Img[] = [];
    const rex = /<img[^>]+src="([^"\s]+)"[^>]*>/g;
    let m = rex.exec(text);
    while (m) {
        urls.push({ src: m[1] });
        m = rex.exec(text);
    }
    return urls;
}

// 附件中提取图片
function getImageFromAttachment(a: MessagingExtensionAttachment): Img[] {
    const imageReg = /^http(s?):\/\/.*\.(?:jpg|gif|png)$/;
    if (a.contentType.startsWith("image") || imageReg.test(a.contentUrl!)) {
        // download attach
        return [{ src: a.contentUrl! }];
    }
    if (a.contentType === "application/vnd.microsoft.card.adaptive" || a.contentType == "application/vnd.microsoft.card.hero") {
        const card: any = typeof a.content === "string" ? JSON.parse(a.content || "{\"body\":[]}") : a.content;
        return card.body.filter(c => c.type === "Image").map((c: CardImage) => ({ src: c.url, alt: c.alt }));
    }
    return [];
}

export async function fetchTaskCollect(context: TurnContext, value: MessagingExtensionAction): Promise<TaskModuleResponse> {
    const id = getUserId(context);
    log("onFetchTask", id);
    const payload = value.messagePayload || {};
    const imgs = getImages(payload.body!.content!);
    const attachments: MessageActionsPayloadAttachment[] = payload.attachments || [];
    attachments.map(getImageFromAttachment).filter(s => !!s).forEach(s => imgs.push(...s));

    log('imgs', imgs)
    const saveImgs = await addUserStickers(id, imgs.map(img => ({ src: img.src, name: img.alt })))
    // log('imgs', saveImgs)

    const card = CardFactory.adaptiveCard(
        {
            type: "AdaptiveCard",
            body: [
                ...saveImgs.map(img => ({
                    url: img.src,
                    type: "Image",
                    altText: img.name,
                    spacing: "None",
                }))
            ],
            actions: [
                // {
                //     type: "Action.Submit",
                //     title: "删除",
                //     data: {
                //         action: "moreDetails",
                //         id: "1234-5678"
                //     }
                // },
                // {
                //     type: "Action.Submit",
                //     title: "确定",
                //     data: {
                //         id: "1234-5678"
                //     }
                // },
            ],
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            version: "1.0"
        });

    const result: TaskModuleContinueResponse = {
        type: "continue",
        value: {
            title: Strings.collect_save_success,
            height: "small",
            width: "small",
            card,
        }
    };
    return Promise.resolve({
        task: result,
    });
}