export interface LoadingConfig {
    name?: string;
    whitelist?: string[];
    blacklist?: string[];
    asNumber?: boolean;
}
declare const _default: (config?: LoadingConfig) => any;
export default _default;
