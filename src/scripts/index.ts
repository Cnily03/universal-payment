import "../stylesheets/index.scss"
import { BASE_URL, CUR_PLATFORM, IS_MOBILE, SUPPORTED_PLATFORMS } from "./components/declaration";
import { Box, BoxUtilSetParams } from "./components/box-util";
import { renderBox } from "./components/render";
import { redirect } from "./components/redirect";
import { DefaultLiteral, DefaultPageConfig } from "./config";
import { handlePageConfig } from "./components/page-config";
import { GetUrlParams } from "./components/url-params";

export const PAGE_CONFIG = handlePageConfig(DefaultPageConfig)
const URL_PARAMS = GetUrlParams()
const PLATFORM = URL_PARAMS.platform || CUR_PLATFORM
const AUTO = URL_PARAMS.auto == undefined ? PAGE_CONFIG.auto : URL_PARAMS.auto

document.addEventListener("DOMContentLoaded", function () {
    renderBox(Boolean(AUTO || URL_PARAMS.platform))
})

var setOptions: BoxUtilSetParams = {
    qrcode: IS_MOBILE ? DefaultLiteral.QRCodeContent_Mobile : DefaultLiteral.QRCodeContent_PC,
    qrcode_alt: DefaultLiteral.QRCodeAlt,
    title: {
        "icon": {
            pc: DefaultLiteral.Title_PC,
            mobile: DefaultLiteral.Title_Mobile
        },
        "logo": {
            pc: DefaultLiteral.Title_PC,
            mobile: DefaultLiteral.Title_Mobile
        },
        "select": {
            pc: DefaultLiteral.TitleSelect_PC,
            mobile: DefaultLiteral.TitleSelect_Mobile
        }
    }[PAGE_CONFIG.type][IS_MOBILE ? "mobile" : "pc"],
    text: {
        "icon": {
            pc: DefaultLiteral.Text_PC,
            mobile: DefaultLiteral.Text_Mobile
        },
        "logo": {
            pc: DefaultLiteral.Text_PC,
            mobile: DefaultLiteral.Text_Mobile
        },
        "select": {
            pc: DefaultLiteral.TextSelect_PC,
            mobile: DefaultLiteral.TextSelect_Mobile
        }
    }[PAGE_CONFIG.type][IS_MOBILE ? "mobile" : "pc"],
    icon: PAGE_CONFIG.type == "icon" ? SUPPORTED_PLATFORMS : [],
    logo: PAGE_CONFIG.type == "logo" ? SUPPORTED_PLATFORMS : [],
    select: PAGE_CONFIG.type == "select" ? SUPPORTED_PLATFORMS : [],
}

Box.registerDefaultOpt(setOptions)


if (AUTO || URL_PARAMS.platform) {
    if (typeof PLATFORM == "string") redirect('at-platform', PLATFORM)
}

document.addEventListener("DOMContentLoaded", function () {
    Box.setDefault(false, true)
})


// 调整手机Edge clientHeight 与 innerHeight 不一致的问题
function justifyInnerHeight() {
    document.documentElement.style.setProperty("--inner-height", window.innerHeight + "px")
}
document.addEventListener("DOMContentLoaded", justifyInnerHeight)
window.addEventListener("resize", justifyInnerHeight)