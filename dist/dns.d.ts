/// <reference types="node" />
import dns from 'dns';
export declare class DNS {
    static lookup(name: string): Promise<object>;
    static resolveAny(name: string): Promise<dns.AnyRecord[]>;
    static reverse(addresses: string[]): Promise<string[]>;
}
