import { PlatformType, PageConfigType, IS_MOBILE } from "./components/declaration";
import { redirect } from "./components/redirect";
import { Box } from "./components/box-util";
import { Style } from "./components/style-util";
const BASE_URL = window.location.origin + window.location.pathname

// ========== 定义一些参数（仅作用于本文件） ==========

import Template from "../template"
namespace ThemeColor {
    export const Alipay = "#027AFF"
    export const WeChat = "#09BB07"
    export const QQ = "#0BB2FF"
}

// ========== 根据 User Agent 检测不同平台的正则表达式 ==========

export namespace UserAgentRegExp {
    export const Alipay = /Alipay/
    export const WeChat = /MicroMessenger/
    export const QQ = /MQQBrowser/
}



// ========== 非 select 模式下的二维码链接 ==========

export namespace QRCodeContent {
    export const Alipay = Template.Alipay
    export const WeChat = Template.WeChat
    export const QQ = Template.QQ
}



// ========== 事件设置 ==========

// 当参数 `auto` 为真并处于相应平台时执行的动作（若为字符串则跳转链接），URL Search 中的参数 `platform` 可显式指定处于相应的平台
export namespace AtPlatformEvent {
    export const Alipay = Template.Alipay
    export const WeChat = function (platform: PlatformType) {
        Box.set({
            title: (/^\[(image|img)\].+$/.exec(Template.WeChat) || [])[0] ? "长按识别二维码" : "请保存二维码后进行扫码",
            text: "",
            qrcode: Template.WeChat,
            qrcode_alt: platform,
            icon: [],
            logo: [platform],
            select: []
        })
        Style.modify("theme-color-1", ThemeColor.WeChat)
        Style.modify("font-color-2", ThemeColor.WeChat)
    }
    export const QQ = function (platform: PlatformType) {
        Box.set({
            title: "长按识别二维码",
            text: "",
            qrcode: Template.QQ,
            qrcode_alt: platform,
            icon: [],
            logo: [platform],
            select: []
        })
        Style.modify("theme-color-1", ThemeColor.QQ)
        Style.modify("font-color-2", ThemeColor.QQ)
    };
}

// 电脑端点击选择框的动作（若为字符串则为二维码内容）
export namespace PCSelectClickEvent {
    export const Alipay = function (platform: PlatformType) {
        Box.set({
            qrcode: Template.Alipay,
            qrcode_alt: platform
        })
        Style.modify("theme-color-1", ThemeColor.Alipay)
        Style.modify("font-color-2", ThemeColor.Alipay)
    }
    export const WeChat = function (platform: PlatformType) {
        Box.set({
            qrcode: Template.WeChat,
            qrcode_alt: platform
        })
        Style.modify("theme-color-1", ThemeColor.WeChat)
        Style.modify("font-color-2", ThemeColor.WeChat)
    }
    export const QQ = function (platform: PlatformType) {
        Box.set({
            qrcode: Template.QQ,
            qrcode_alt: platform
        })
        Style.modify("theme-color-1", ThemeColor.QQ)
        Style.modify("font-color-2", ThemeColor.QQ)
    };
}

// 手机端点击选择框的动作（若为字符串则为链接跳转）
export namespace MobileSelectClickEvent {
    export const Alipay = function (platform: PlatformType) {
        Style.modify("theme-color-1", ThemeColor.Alipay)
        Style.modify("font-color-2", ThemeColor.Alipay)
        var uri = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURI(Template.Alipay)
        Box.QRCode.set(uri)
        redirect(uri)
    }
    export const WeChat = function (platform: PlatformType) {
        Box.QRCode.set(Template.WeChat).then(() => {
            Style.modify("theme-color-1", ThemeColor.WeChat)
            Style.modify("font-color-2", ThemeColor.WeChat)
            if (IS_MOBILE) alert("请保存二维码后使用微信扫码")
        })
    }
    export const QQ = function (platform: PlatformType) {
        Box.QRCode.set(Template.QQ).then(() => {
            Style.modify("theme-color-1", ThemeColor.QQ)
            Style.modify("font-color-2", ThemeColor.QQ)
            if (IS_MOBILE) alert("请保存二维码后使用 QQ 扫码")
        })
    }
}



// ========== 默认页面配置 ==========

export const DefaultPageConfig: Partial<PageConfigType> = {
    auto: true,
    type: {
        pc: "icon",
        mobile: "select"
    },
    iframe_no_redirect: true
}



// ========== 其他显示配置 ==========

export namespace DefaultLiteral {
    export const QRCodeContent_PC = BASE_URL + "?auto=1"
    export const QRCodeContent_Mobile = BASE_URL + "?auto=1"
    export const QRCodeAlt = "支付二维码"
    // type 不为 select 时
    export const Title_PC = "扫码支付"
    export const Text_PC = "推荐使用以下平台扫码支付"
    export const Title_Mobile = "扫码支付"
    export const Text_Mobile = "请选择支付方式"
    // type 为 select 时
    export const TitleSelect_PC = "扫码支付"
    export const TextSelect_PC = "推荐使用以下平台扫码支付"
    export const TitleSelect_Mobile = "扫码支付"
    export const TextSelect_Mobile = "请选择支付方式"
}