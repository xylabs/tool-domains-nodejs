import { Validator } from "./validator";
import { ValueConfig } from "../config/value";
export declare class ValueValidator extends Validator<ValueConfig> {
    data: string[] | object[] | number[];
    constructor(config: ValueConfig, data: string[] | object[] | number[]);
    validate(): Promise<number>;
    private validateRequired;
    private checkValue;
}
