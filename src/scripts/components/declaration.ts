import { isIframe, Message } from "./message";
import { PageConfigType } from "./page-config";
import { PlatformType, getPlatform, getSupportPlaforms, isMobile } from "./user-agent";
export { PlatformType, PageConfigType, Message }

export const SUPPORTED_PLATFORMS = getSupportPlaforms()
export const IS_MOBILE = isMobile()
export const CUR_PLATFORM = getPlatform()
export const BASE_URL = window.location.origin + window.location.pathname

export const IS_IFRAME = isIframe()

export const DEFAULT_PAGE_CONFIG: PageConfigType = {
    auto: true,
    type: {
        pc: "icon",
        mobile: "select"
    },
    iframe_no_redirect: true
}

// Override `alert`
const _alert = window.alert
window.alert = (message?: any) => setTimeout(() => _alert(message), 0)