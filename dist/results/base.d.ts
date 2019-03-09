export declare class BaseResult {
    name: string;
    errors?: string[];
    constructor(name: string);
    addError(err: string): void;
}
