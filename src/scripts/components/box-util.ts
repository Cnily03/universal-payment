import qrcode, { QRCodeRenderersOptions } from "qrcode";
import { PlatformType } from "./declaration";

class DefaultPreventedRecord {
    private static defaultPrevented = false;
    static preventDefault() {
        return this.defaultPrevented = true
    }
    static isDefaultPrevented() { return this.defaultPrevented }
}

export namespace Box {
    var DEFAULT_OPTIONS: BoxUtilSetParams
    export const registerDefaultOpt = (options: BoxUtilSetParams) => {
        DEFAULT_OPTIONS = options
    }
    export class QRCode extends DefaultPreventedRecord {
        static DOM: HTMLElement;
        private static OPTIONS: QRCodeRenderersOptions = {
            errorCorrectionLevel: "H",
            margin: 2,
            color: {
                dark: "#000",
                light: "#FFF"
            }
        }
        static async base64(text: string) {
            return qrcode.toDataURL(text, { type: "image/png", ...this.OPTIONS })
        }
        static async canvas(text: string, canvas?: HTMLCanvasElement) {
            if (canvas) return qrcode.toCanvas(canvas, text, this.OPTIONS)
            else return qrcode.toCanvas(text, this.OPTIONS)
        }
        static async set(text: string) {
            const b64URL = await this.base64(text)
            this.DOM.getElementsByTagName("img")[0].src = b64URL
        }
        static changeAlt(text: string) {
            return this.Alt.set(text)
        }
        static Alt = class extends DefaultPreventedRecord {
            static set(text: string) {
                QRCode.DOM.getElementsByTagName("img")[0].alt = text
            }
        }
    }

    export class Title extends DefaultPreventedRecord {
        static DOM: HTMLElement;
        static set(text: string) {
            return this.DOM.innerHTML = text;
        }
    }

    export class Text extends DefaultPreventedRecord {
        static DOM: HTMLElement;

        static set(text: string) {
            return this.DOM.innerHTML = text;
        }
    }

    class PlatformElementsClass extends DefaultPreventedRecord {
        static DOM: HTMLElement;
        private static displayDOM() {
            if (this.DOM.childElementCount) this.DOM.classList.remove("hidden")
        }
        private static hideDOM() {
            this.DOM.classList.add("hidden")
        }
        static showAll() {
            for (const e of this.DOM.children)
                e.classList.add("display")
            this.displayDOM()
        }
        static show(...args: PlatformType[]) {
            for (const e of this.DOM.children) {
                if (args.includes((e.getAttribute("data-platform") as string) as PlatformType))
                    e.classList.add("display")
            }
            if (args.length) this.displayDOM()
        }
        static reserve(...args: PlatformType[]) {
            for (const e of this.DOM.children) {
                if (args.includes((e.getAttribute("data-platform") as string) as PlatformType))
                    e.classList.add("display")
                else e.classList.remove("display")
            }
            if (args.length) this.displayDOM()
            else this.hideDOM()
        }
        static hideAll() {
            for (const e of this.DOM.children)
                e.classList.remove("display")
            this.hideDOM()
        }
        static remove(...args: PlatformType[]) {
            for (const e of this.DOM.children) {
                if (args.includes((e.getAttribute("data-platform") as string) as PlatformType))
                    e.classList.remove("display")
            }
            if (args.length == this.DOM.childElementCount) this.hideDOM()
        }
    }

    export class Icon extends PlatformElementsClass {
        static DOM: HTMLElement;
    }

    export class Logo extends PlatformElementsClass {
        static DOM: HTMLElement;
    }

    export class Select extends PlatformElementsClass {
        static DOM: HTMLElement;
    }

    export function set(params: BoxUtilSetParams, setPreventDefault = true, detectPreventDefault = false) {
        if (params.qrcode && (!detectPreventDefault || !Box.QRCode.isDefaultPrevented())) {
            Box.QRCode.set(params.qrcode)
            if (setPreventDefault) Box.QRCode.preventDefault()
        }
        if ((params.qrcode_alt || params.qrcode_alt == "") && (!detectPreventDefault || !Box.QRCode.Alt.isDefaultPrevented())) {
            Box.QRCode.Alt.set(params.qrcode_alt)
            if (setPreventDefault) Box.QRCode.Alt.preventDefault()
        }

        if ((params.title || params.title == "") && (!detectPreventDefault || !Box.Title.isDefaultPrevented())) {
            Box.Title.set(params.title)
            if (setPreventDefault) Box.Title.preventDefault()
        }

        if ((params.text || params.text == "") && (!detectPreventDefault || !Box.Text.isDefaultPrevented())) {
            Box.Text.set(params.text)
            if (setPreventDefault) Box.Text.preventDefault()
        }

        if (params.icon && !Array.isArray(params.icon)) params.icon = [params.icon]
        if (params.icon && (!detectPreventDefault || !Box.Icon.isDefaultPrevented())) {
            Box.Icon.reserve(...params.icon)
            if (setPreventDefault) Box.Icon.preventDefault()
        }

        if (params.logo && !Array.isArray(params.logo)) params.logo = [params.logo]
        if (params.logo && (!detectPreventDefault || !Box.Logo.isDefaultPrevented())) {
            Box.Logo.reserve(...params.logo)
            if (setPreventDefault) Box.Logo.preventDefault()
        }

        if (params.select && !Array.isArray(params.select)) params.select = [params.select]
        if (params.select && (!detectPreventDefault || !Box.Select.isDefaultPrevented())) {
            Box.Select.reserve(...params.select)
            if (setPreventDefault) Box.Select.preventDefault()
        }
    }

    export const setDefault = (setPreventDefault = false, detectPreventDefault = true) =>
        Box.set(DEFAULT_OPTIONS, setPreventDefault, detectPreventDefault)
}

export type BoxUtilSetParams = {
    qrcode?: string
    qrcode_alt?: string
    title?: string
    text?: string
    icon?: PlatformType | PlatformType[]
    logo?: PlatformType | PlatformType[]
    select?: PlatformType | PlatformType[]
}

document.addEventListener("DOMContentLoaded", function () {
    Box.QRCode.DOM = document.getElementById("qr-box") as HTMLElement
    Box.Title.DOM = document.getElementById("title-box") as HTMLElement
    Box.Text.DOM = document.getElementById("text-box") as HTMLElement
    Box.Icon.DOM = document.getElementById("icon-box") as HTMLElement
    Box.Logo.DOM = document.getElementById("logo-box") as HTMLElement
    Box.Select.DOM = document.getElementById("select-box") as HTMLElement
})