import { SUPPORTED_PLATFORMS } from "./declaration";
import { PlatformType } from "./user-agent";

const GetOriginalUrlValue = function (name: string) {
    var reg = new RegExp('(^|&)' + encodeURI(name) + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.slice(1).match(reg);
    if (r != null) {
        try {
            let val = decodeURIComponent(r[2]);
            return /^[0-9]+$/.test(val) ? Number(val) : val;
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

type URLParamsType = "auto" | "platform"

function isSupportedPlatform(platform?: any): platform is PlatformType {
    if (typeof platform !== "string") return false
    return (SUPPORTED_PLATFORMS as any).includes(platform)
}


export function GetUrlValue(name: "auto"): boolean | undefined
export function GetUrlValue(name: "platform"): PlatformType | undefined
export function GetUrlValue(name: URLParamsType) {
    if (name == "auto") {
        const val = GetOriginalUrlValue("auto")
        return typeof val == "undefined" ? undefined : Boolean(val)
    }
    else if (name == "platform") {
        const val = GetOriginalUrlValue("platform")
        return isSupportedPlatform(val) ? val : undefined
    }
}

export const GetUrlParams = () => {
    return {
        auto: GetUrlValue("auto"),
        platform: GetUrlValue("platform")
    }
}