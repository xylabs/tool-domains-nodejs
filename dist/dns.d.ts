/// <reference types="node" />
import dns from 'dns';
export declare class DNS {
    static lookup(name: string): Promise<string>;
    static resolveAny(name: string): Promise<dns.AnyRecord[]>;
    static reverse(address: string): Promise<string[]>;
}
