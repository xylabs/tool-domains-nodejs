import 'chalk';
export declare class BaseValidator {
    name: string;
    errors?: object[];
    constructor(name: string);
    addError(action: string, error: any): void;
}
