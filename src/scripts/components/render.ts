import { CUR_PLATFORM, IS_MOBILE, PlatformType, SUPPORTED_PLATFORMS } from "./declaration";
import { Box } from "./box-util";
import { StrictPageConfigType } from "./page-config";
import { redirect } from "./redirect";

function node(type: StrictPageConfigType["type"], platform: PlatformType) {
    const node = document.createElement("div")
    node.classList.add(type)
    node.classList.add(`icon-${platform}`)
    node.setAttribute("data-platform", platform)
    return node
}
function textNode() {
    return document.createTextNode("\n")
}

export const renderBox = (isAtPlatform = false) => {
    for (const platform of SUPPORTED_PLATFORMS) {
        Box.Icon.DOM.appendChild(node("icon", platform));
        Box.Icon.DOM.appendChild(textNode())
    }
    for (const platform of SUPPORTED_PLATFORMS) {
        Box.Logo.DOM.appendChild(node("logo", platform))
        Box.Logo.DOM.appendChild(textNode())
    }
    for (const platform of SUPPORTED_PLATFORMS) {
        var s_node = node("select", platform)
        Box.Select.DOM.appendChild(s_node)
        Box.Select.DOM.appendChild(textNode())
        // ClickEvent
        s_node.addEventListener("click", function () {
            if (this.classList.contains("active")) { // click to vanish
                this.classList.remove("active")
                isAtPlatform && CUR_PLATFORM ?
                    redirect("at-platform", platform) :
                    Box.setDefault(false, false)
            } else { // click to activate
                for (const e of (this.parentElement as HTMLElement).children)
                    e.classList.remove("active")
                this.classList.add("active")
                setTimeout(() => {
                    Box.setDefaultWithoutQRCode(false, false)
                    redirect(IS_MOBILE ? "mobile-select" : "pc-select", platform)
                }, IS_MOBILE ? 10 : 0)
            }
        })
    }
}