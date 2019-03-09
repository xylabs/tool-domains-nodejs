import { AWS } from './aws';
import { Expected } from './expected';
import { Domain } from './domain';
export declare class Config {
    static load(fileName?: string): Promise<Config>;
    verbose: boolean;
    aws?: AWS;
    expected?: Expected;
    domains?: Domain[];
}
