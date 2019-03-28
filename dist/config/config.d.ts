export declare class Config {
    static parse(source: any): Config | undefined;
    key: string;
    enabled?: boolean;
    constructor(key: string);
    isEnabled(): boolean;
    merge(config?: any): any;
}
