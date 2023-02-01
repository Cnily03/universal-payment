import { PlatformType, PageConfigType } from "./components/declaration";
import { Box } from "./components/box-util";
const BASE_URL = window.location.origin + window.location.pathname



// ========== 根据 User Agent 检测不同平台的正则表达式 ==========
export namespace UserAgentRegExp {
    export const Alipay = /Alipay/
    export const WeChat = /MicroMessenger/
    export const QQ = /MQQBrowser/
}



// ========== 非 select 模式下的二维码链接 ==========
export namespace QRCodeContent {
    export const Alipay = "https://qr.alipay.com/fkx107738tlkf2dmserum29"
    export const WeChat = "wxp://f2f0AY4xiChya0nbV8Eqm54019R0LwEkCWe7vH8kqAKtddI"
    export const QQ = "https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQxYnKxwgYpbbKngZCIDFiZjM1NjdhODAxMmEwZDhhYTU5OGVjNjFmMGVkNjU4_xxx_sign&u=2297595077"
}



// ========== 事件设置 ==========

// 当参数 `auto` 为真并处于相应平台时执行的动作（若为字符串则跳转链接），URL Search 中的参数 `platform` 可显式指定处于相应的平台
export namespace AtPlatformEvent {
    export const Alipay = "https://qr.alipay.com/fkx107738tlkf2dmserum29"
    export const WeChat = function (platform: PlatformType) {
        Box.set({
            title: "长按识别二维码",
            text: "",
            qrcode: "wxp://f2f0AY4xiChya0nbV8Eqm54019R0LwEkCWe7vH8kqAKtddI",
            qrcode_alt: platform,
            icon: [],
            logo: [platform],
            select: []
        })
    }
    export const QQ = function (platform: PlatformType) {
        Box.set({
            title: "长按识别二维码",
            text: "",
            qrcode: "https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQxYnKxwgYpbbKngZCIDFiZjM1NjdhODAxMmEwZDhhYTU5OGVjNjFmMGVkNjU4_xxx_sign&u=2297595077",
            qrcode_alt: platform,
            icon: [],
            logo: [platform],
            select: []
        })
    };
}

// 电脑端点击选择框的动作（若为字符串则为二维码内容）
export namespace PCSelectClickEvent {
    export const Alipay = "https://qr.alipay.com/fkx107738tlkf2dmserum29"
    export const WeChat = function (platform: PlatformType) {
        Box.set({
            qrcode: BASE_URL + "?platform=WeChat",
            qrcode_alt: platform
        })
    }
    export const QQ = function (platform: PlatformType) {
        Box.set({
            qrcode: BASE_URL + "?platform=QQ",
            qrcode_alt: platform
        })
    };
}

// 手机端点击选择框的动作（若为字符串则为链接跳转）
export namespace MobileSelectClickEvent {
    export const Alipay = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURI("https://qr.alipay.com/fkx107738tlkf2dmserum29")
    export const WeChat = function (platform: PlatformType) {
        Box.QRCode.set("wxp://f2f0AY4xiChya0nbV8Eqm54019R0LwEkCWe7vH8kqAKtddI")
            .then(() => alert("请保存二维码后使用微信扫码"))
    }
    export const QQ = function (platform: PlatformType) {
        Box.QRCode.set("https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQxYnKxwgYpbbKngZCIDFiZjM1NjdhODAxMmEwZDhhYTU5OGVjNjFmMGVkNjU4_xxx_sign&u=2297595077")
            .then(() => alert("请保存二维码后使用 QQ 扫码"))
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