const COMPUTED_STYLE = window.getComputedStyle(document.documentElement)
export const GetStyleVariable = (key: string) => {
    return COMPUTED_STYLE.getPropertyValue("--" + key)
}
export const SetStyleVariables = (key: string, value: string | null) => {
    return document.documentElement.style.setProperty("--" + key, value)
}

export namespace Style {

    var DEFAULT_OPTIONS: StyleSetParams
    export const registerDefaultOpt = (options: StyleSetParams) => {
        DEFAULT_OPTIONS = options
    }

    /**
     * 设置单个变量
     */
    export const modify = <T extends keyof StyleSetParams>(key: T, value: StyleSetParams[T]) => SetStyleVariables(key, value)

    /**
     * 设置多个变量
     */
    export const set = (params: Partial<StyleSetParams>) => {
        for (const key in params) {
            modify(key as keyof StyleSetParams, params[key as keyof StyleSetParams] as StyleSetParams[keyof StyleSetParams])
        }
    }

    export const setDefault = () => set(DEFAULT_OPTIONS)
}

export type StyleSetParams = {
    "theme-color-1": string
    "theme-color-2": string
    "font-color-1": string
    "font-color-2": string
}