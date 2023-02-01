import { UserAgentRegExp as UARE } from "../config";
export type PlatformType = keyof typeof UARE;

export function getPlatform() {
    for (const platform in UARE)
        if (UARE[platform as PlatformType].test(navigator.userAgent)) return platform as PlatformType;
    return undefined;
}

export function getSupportPlaforms() {
    return Object.keys(UARE) as PlatformType[];
}

export function isMobile() {
    return /mobile|android|iphone/.test(navigator.userAgent.toLowerCase())
}