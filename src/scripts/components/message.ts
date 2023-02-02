import { IS_IFRAME } from "./declaration"

export function isIframe() { return window.self != window.top }

type MessageType = {
    type: string,
    value?: any
}

const IDENTIFIER_PREFIX = "[universal-payment]+"

export const postParentMessage = (message: MessageType, onlyIframe = true) => {
    if (onlyIframe && !IS_IFRAME) return
    const origin = (function () {
        try {
            return window.parent.location.origin
        } catch {
            return document.referrer || "*"
        }
    })()
    window.parent.postMessage(IDENTIFIER_PREFIX + JSON.stringify(message), origin)
}

export const registerMessageHandler = (handler: (data: MessageType) => void, onlyIframe = true) => {
    if (onlyIframe && !IS_IFRAME) return
    window.self.addEventListener("message", function (e) {
        if (typeof e.data == "string" && e.data.indexOf(IDENTIFIER_PREFIX) == 0) {
            try {
                const data = JSON.parse(e.data.slice(IDENTIFIER_PREFIX.length))
                if (typeof data["type"] == "string")
                    handler(data as MessageType)
            } catch (_) { }
        }
    })
}

export namespace Message {
    export const post = postParentMessage
    export const receive = registerMessageHandler
}