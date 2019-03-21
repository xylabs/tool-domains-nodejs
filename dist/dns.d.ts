/// <reference types="node" />
import { MxRecord } from 'dns';
export declare class Dns {
    static lookup(name: string): Promise<string>;
    static resolve(name: string, type: string): Promise<any[]>;
    static resolve4(name: string): Promise<string[]>;
    static resolveCname(name: string): Promise<string[]>;
    static resolveMx(name: string): Promise<MxRecord[]>;
    static resolveTxt(name: string): Promise<string[][]>;
    static reverse(address: string): Promise<string[]>;
}
