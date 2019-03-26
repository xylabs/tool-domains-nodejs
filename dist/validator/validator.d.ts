import { ValidationError } from './error';
import { Config } from '../config/config';
export declare class Validator<T extends Config> {
    config: T;
    errors?: ValidationError[];
    errorCount: number;
    constructor(config: T);
    toJSON(): Pick<this, ({ [P in keyof this]: P; } & {
        config: never;
    } & {
        [x: string]: never;
    })[keyof this]>;
    validate(): Promise<number>;
    addError(action: string, error: any): void;
    addErrors(errors: ValidationError[] | undefined): void;
}
