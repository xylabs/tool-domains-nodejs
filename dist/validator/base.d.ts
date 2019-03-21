import { ValidationError } from './error';
export declare class BaseValidator {
    name: string;
    errors?: ValidationError[];
    errorCount: number;
    constructor(name: string);
    toJSON(): Partial<this>;
    validate(): Promise<number>;
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
