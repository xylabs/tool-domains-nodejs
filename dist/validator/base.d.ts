import { ValidationError } from './error';
export declare class BaseValidator {
    name: string;
    errors?: ValidationError[];
    valid?: boolean;
    constructor(name: string);
    validate(arg: any): Promise<number>;
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
