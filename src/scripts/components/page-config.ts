import { DEFAULT_PAGE_CONFIG, IS_MOBILE } from "./declaration";

type PlatformSpecific<T> = T | { mobile: T, pc: T }
type ObjectPlatformSpecific<T> = {
    [P in keyof T]: PlatformSpecific<T[P]>
}
export type PageConfigType = ObjectPlatformSpecific<StrictPageConfigType>
export type StrictPageConfigType = {
    /** 在平台内部是否自动跳转（执行 `AtPlatformEvent` 定义的内容） */
    auto: boolean,
    /** 以何种方式显示图标 */
    type: "icon" | "logo" | "select",
    /**
     * 如果网页在 iframe 中，则禁止链接跳转，转为向上级页面 `postMessage`，发送的数据为
     * ```javascript
     * JSON.stringfy({
     *     type: "openurl",
     *     value: URL
     * })
     * ```
     */
    iframe_no_redirect: boolean
}

export const mergeOptions = <T>(options: T, patch: Partial<T>) => {
    for (const key of Array.from(new Set([...Object.keys(options as {}), ...Object.keys(patch as {})]))) {
        const _options = (options as any)[key], _patch = (patch as any)[key];
        if (isJSON(_options) && isJSON(_patch))
            (patch as any)[key] = mergeOptions(_options, _patch);
    }
    return { ...options, ...patch } as T;
}

function isJSON(obj: any): obj is { [k: string]: any, [k: number]: any } {
    return typeof obj == 'object' && obj != null && !Array.isArray(obj) && JSON.stringify(obj).indexOf('{') == 0
}

export const handlePageConfig = (params: Partial<PageConfigType>) => {
    return mergeOptions<StrictPageConfigType>(
        pickOutPlatformSpecificForObject(DEFAULT_PAGE_CONFIG),
        pickOutPlatformSpecificForObject(params)
    )
}

function pickOutPlatformSpecific<T>(value: PlatformSpecific<T>) {
    if (isJSON(value) && Object.keys(value).includes("pc") && Object.keys(value).includes("mobile"))
        return value[IS_MOBILE ? "mobile" : "pc"] as T;
    else return value as T;
}

function pickOutPlatformSpecificForObject<T>(obj: ObjectPlatformSpecific<T>) {
    for (const key in obj) {
        obj[key] = pickOutPlatformSpecific(obj[key])
    }
    return obj as T
} 