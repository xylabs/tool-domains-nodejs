import { ValidationError } from './error';
import { Config } from '../config';
export declare class BaseValidator {
    name: string;
    errors?: ValidationError[];
    errorCount: number;
    protected config: Config;
    constructor(config: any, name: string);
    toJSON(): Partial<this>;
    validate(): Promise<number>;
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
