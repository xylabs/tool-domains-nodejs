import { ValidationError } from './error';
export declare class BaseValidator {
    name: string;
    errors?: ValidationError[];
    valid?: boolean;
    protected config: any;
    constructor(config: {
        name: string;
    });
    toJSON(): Partial<this>;
    validate(config: {}): Promise<number>;
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
