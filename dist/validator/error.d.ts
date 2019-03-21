export declare class ValidationError extends Error {
    action: string;
    source: any;
    constructor(action: string, source: any);
}
