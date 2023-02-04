import "../stylesheets/index.scss"
import { BASE_URL, CUR_PLATFORM, IS_IFRAME, IS_MOBILE, SUPPORTED_PLATFORMS, Message } from "./components/declaration";
import { Box, BoxUtilSetParams } from "./components/box-util";
import { renderBox } from "./components/render";
import { redirect } from "./components/redirect";
import { DefaultLiteral, DefaultPageConfig } from "./config";
import { StrictPageConfigType, handlePageConfig } from "./components/page-config";
import { GetUrlParams } from "./components/url-params";
import { GetStyleVariable, SetStyleVariables, Style, StyleSetParams } from "./components/style-util";

const PAGE_CONFIG = handlePageConfig(DefaultPageConfig)
const URL_PARAMS = GetUrlParams()
const PLATFORM = URL_PARAMS.platform || CUR_PLATFORM
export const FINAL_CONFIG: StrictPageConfigType = {
    ...PAGE_CONFIG,
    auto: URL_PARAMS.auto == undefined ? PAGE_CONFIG.auto : URL_PARAMS.auto,
    type: URL_PARAMS.type == undefined ? PAGE_CONFIG.type : URL_PARAMS.type
}

// render the HTML Element
document.addEventListener("DOMContentLoaded", function () {
    renderBox(Boolean(FINAL_CONFIG.auto || URL_PARAMS.platform))
})

var setBoxOptions: BoxUtilSetParams = {
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
    }[FINAL_CONFIG.type][IS_MOBILE ? "mobile" : "pc"],
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
    }[FINAL_CONFIG.type][IS_MOBILE ? "mobile" : "pc"],
    icon: FINAL_CONFIG.type == "icon" ? SUPPORTED_PLATFORMS : [],
    logo: FINAL_CONFIG.type == "logo" ? SUPPORTED_PLATFORMS : [],
    select: FINAL_CONFIG.type == "select" ? SUPPORTED_PLATFORMS : [],
}

Box.registerDefaultOpt(setBoxOptions)

var setStyleOptions: StyleSetParams = {
    "theme-color-1": GetStyleVariable("theme-color-1"),
    "theme-color-2": GetStyleVariable("theme-color-2"),
    "font-color-1": GetStyleVariable("font-color-1"),
    "font-color-2": GetStyleVariable("font-color-2")
}

Style.registerDefaultOpt(setStyleOptions)


// automatically redirect to platform page
if (FINAL_CONFIG.auto || URL_PARAMS.platform) {
    if (typeof PLATFORM == "string") redirect('at-platform', PLATFORM)
}

// render Box
document.addEventListener("DOMContentLoaded", function () {
    Box.setDefault(false, true)
})

// Post Container Height
document.addEventListener("DOMContentLoaded", function () {
    const DOM = document.getElementsByClassName("container")[0]
    const postContainerSize = () => {
        if (IS_IFRAME) {
            const { height, width } = window.getComputedStyle(DOM)
            Message.post({
                type: "size",
                value: { height, width }
            })
        }
    }

    // Register the observer
    const observerConfig: MutationObserverInit = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    }
    var observer = new MutationObserver((rec, obs) => {
        postContainerSize()
        obs.disconnect()
        setTimeout(() => { obs.observe(DOM, observerConfig) }, 1)
    })
    observer.observe(DOM, observerConfig);

    // Register the message receiver
    Message.receive((data) => {
        if (data.type = "query-size") {
            postContainerSize()
        }
    })

    // Repost the size
    postContainerSize()
})

// Correct the conditoiin that in Mobile Edge clientHeight is not `equal` to `innerHeight`
function justifyInnerHeight() {
    SetStyleVariables("inner-height", window.innerHeight + "px")
}
document.addEventListener("DOMContentLoaded", justifyInnerHeight)
window.addEventListener("resize", justifyInnerHeight)