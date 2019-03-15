import { ValidationError } from './error';
export declare class BaseValidator {
    name: string;
    errors?: ValidationError[];
    constructor(name: string);
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
