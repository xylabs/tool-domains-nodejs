export declare class BaseValidator {
    name: string;
    errors?: string[];
    constructor(name: string);
    addError(err: string): void;
    protected getHttpResponse(ssl?: boolean, timeout?: number): Promise<string>;
}
