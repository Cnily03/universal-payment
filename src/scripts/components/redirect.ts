import { PAGE_CONFIG } from "..";
import { AtPlatformEvent, MobileSelectClickEvent, PCSelectClickEvent, QRCodeContent } from "../config";
import { Box } from "./box-util";
import { PlatformType } from "./declaration";

type PaymentUriType = string | ((platform?: string) => any)
type CallAppUriType = string | ((platform?: string) => any)

function jumpToURL(url: string) {
    if (PAGE_CONFIG.iframe_no_redirect && window.self != window.top) {
        window.parent.postMessage(JSON.stringify({
            type: "openurl",
            value: url
        }), window.origin)
    } else window.location.href = url
}

var DOMContentLoaded = false
document.addEventListener("DOMContentLoaded", function () {
    DOMContentLoaded = true;
})

type redirectType = 'qrcode' | 'at-platform' | 'pc-select' | 'mobile-select'
/**
 * 跳转到链接
 */
export function redirect(url: string): void;
/**
 * 跳转到链接
 */
export function redirect(type: 'url', value: string): void;
/**
* 跳转或执行某个平台对应的链接或事件
*/
export function redirect(type: redirectType, value: PlatformType): void;
export function redirect(type: 'url' | redirectType | string, value?: string) {
    if (typeof value == 'undefined') jumpToURL(type)
    else if (type == 'url') jumpToURL(value);
    else if (type == 'qrcode') window.location.href = QRCodeContent[value as PlatformType];
    else if (type == 'at-platform') {
        const t = AtPlatformEvent[value as PlatformType] as PaymentUriType;
        typeof t == "string" ?
            jumpToURL(t) : (DOMContentLoaded ?
                t(value as PlatformType) :
                document.addEventListener("DOMContentLoaded", () => t(value as PlatformType)));
    }
    else if (type == 'pc-select') {
        const t = PCSelectClickEvent[value as PlatformType] as PaymentUriType;
        typeof t == "string" ?
            (Box.QRCode.set(t), Box.QRCode.changeAlt(value)) : (DOMContentLoaded ?
                t(value as PlatformType) :
                document.addEventListener("DOMContentLoaded", () => t(value as PlatformType)));
    }
    else if (type == 'mobile-select') {
        const t = MobileSelectClickEvent[value as PlatformType] as CallAppUriType;
        typeof t == "string" ?
            jumpToURL(t) : (DOMContentLoaded ?
                t(value as PlatformType) :
                document.addEventListener("DOMContentLoaded", () => t(value as PlatformType)));
    } else throw new Error(`Unkown type "${type}"`)
}