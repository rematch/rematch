import { Plugin } from '@rematch/core';
export interface LoadingConfig {
    name?: string;
    whitelist?: string[];
    blacklist?: string[];
    asNumber?: boolean;
}
declare const _default: (config?: LoadingConfig) => Plugin;
export default _default;
