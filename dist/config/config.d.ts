export declare class Config {
    key: string;
    enabled?: boolean;
    constructor(key: string);
    isEnabled(): boolean;
    merge(config?: any): any;
}
