export declare class DnsClient {
    private host;
    private expectedLength;
    constructor(host?: string);
    resolve(name: string, type: string): Promise<any>;
    private getRandomInt;
}
