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

    namespace QRCodeParamTypeMap {
        export const content = "content"
        export const url = "content"
        export const uri = "content"
        export const link = "content"
        export const lnk = "content"
        export const image = "image"
        export const img = "image"
    }
    type PureQRCodeParamType = keyof typeof QRCodeParamTypeMap
    type QRCodeParamType = PureQRCodeParamType | `!${PureQRCodeParamType}`
    type FinalQRCodeParamType = (typeof QRCodeParamTypeMap)[PureQRCodeParamType]

    export class QRCode extends DefaultPreventedRecord {
        static get DOM() { return this.DOM = document.getElementById("qr-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }
        private static OPTIONS: QRCodeRenderersOptions = {
            errorCorrectionLevel: "H",
            margin: 2,
            color: {
                dark: "#000",
                light: "#FFF"
            }
        }
        private static async getImageURI(str: string, type: QRCodeParamType) {
            if (type.startsWith("!")) type = type.slice(1) as PureQRCodeParamType
            if (!Object.keys(QRCodeParamTypeMap).includes(type)) type = "content"
            var finalType: FinalQRCodeParamType = QRCodeParamTypeMap[type as PureQRCodeParamType]
            if (finalType == "content") {
                return await this.base64(str)
            } else if (finalType == "image") {
                return str
            }
            return str
        }
        private static async base64(text: string) {
            return qrcode.toDataURL(text, { type: "image/png", ...this.OPTIONS })
        }
        private static async canvas(text: string, canvas?: HTMLCanvasElement) {
            if (canvas) return qrcode.toCanvas(canvas, text, this.OPTIONS)
            else return qrcode.toCanvas(text, this.OPTIONS)
        }
        /**
         * 设置二维码内容
         * @param type 默认为 `auto`，会采取 `text` 开头以 `[]` 括起来的内容作为类型，如果开头带有感叹号 `!`，表示生成的 QRCode 的缩放将不会采用像素化的方式。所有 fallback 类型均为 `content`
         */
        static async set(text: string, type: "auto" | QRCodeParamType = "auto", cancelPixelated?: boolean) {
            if (type == "auto") {
                var splited = /^\[(.+)\](.+)$/.exec(text) || []
                var _type = splited[1] || "content"
                if (typeof cancelPixelated == "undefined") cancelPixelated = _type.startsWith("!")
                text = splited[2] || text
                if (!Object.keys(QRCodeParamTypeMap).includes(_type.startsWith("!") ? _type.slice(1) : _type)) type = "content"
                else type = _type as QRCodeParamType
            }
            const srcUri = await this.getImageURI(text, type)
            await new Promise(resolve => {
                this.DOM.getElementsByTagName("img")[0]
                    .addEventListener("load", function _loadListener() {
                        resolve(true)
                        this.removeEventListener("load", _loadListener)
                        if (cancelPixelated) QRCode.cancelPixelated()
                        else this.style.imageRendering = ""
                    })
                this.DOM.getElementsByTagName("img")[0].src = srcUri
            })
        }
        static changeAlt(text: string) {
            return this.Alt.set(text)
        }
        /**
         * 暂时取消像素化放大
         */
        static cancelPixelated() {
            this.DOM.getElementsByTagName("img")[0].style.imageRendering = "auto"
        }
        static Alt = class extends DefaultPreventedRecord {
            static set(text: string) {
                QRCode.DOM.getElementsByTagName("img")[0].alt = text
            }
        }
    }

    export class Title extends DefaultPreventedRecord {
        static get DOM() { return this.DOM = document.getElementById("title-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }
        static set(text: string) {
            return this.DOM.innerHTML = text;
        }
    }

    export class Text extends DefaultPreventedRecord {
        static get DOM() { return this.DOM = document.getElementById("text-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }

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
        static get DOM() { return this.DOM = document.getElementById("icon-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }
    }

    export class Logo extends PlatformElementsClass {
        static get DOM() { return this.DOM = document.getElementById("logo-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }
    }

    export class Select extends PlatformElementsClass {
        static get DOM() { return this.DOM = document.getElementById("select-box") as HTMLElement }
        static set DOM(value: HTMLElement) {
            Object.defineProperty(this, "DOM", { writable: true })
            this.DOM = value
        }
    }

    /**
     * 设置值
     * @param setPreventDefault 阻止默认事件
     * @param detectPreventDefault 如果默认事件被阻止则不执行
     * @param noQRCodeRender 不渲染 QRCode
     */
    export async function set(params: BoxUtilSetParams, setPreventDefault = true, detectPreventDefault = false, noQRCodeRender = false) {
        if (!noQRCodeRender) {
            if (params.qrcode && (!detectPreventDefault || !Box.QRCode.isDefaultPrevented())) {
                if (setPreventDefault) Box.QRCode.preventDefault()
                await Box.QRCode.set(params.qrcode, "auto", typeof params.qrcode_pixelated == "undefined" ? undefined : !params.qrcode_pixelated)
            }
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

    /**
     * 全部恢复默认值
     */
    export const setDefault = (setPreventDefault = false, detectPreventDefault = true) =>
        Box.set(DEFAULT_OPTIONS, setPreventDefault, detectPreventDefault)

    /**
     * 全部恢复默认值（除 QRCode 图片）
     */
    export const setDefaultWithoutQRCode = (setPreventDefault = false, detectPreventDefault = true) =>
        Box.set(DEFAULT_OPTIONS, setPreventDefault, detectPreventDefault, true)
}

export type BoxUtilSetParams = {
    qrcode?: string
    qrcode_alt?: string
    qrcode_pixelated?: boolean,
    title?: string
    text?: string
    icon?: PlatformType | PlatformType[]
    logo?: PlatformType | PlatformType[]
    select?: PlatformType | PlatformType[]
}