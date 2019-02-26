export declare class XyDomainScan {
    private r53;
    start(): Promise<void>;
    private getZones;
    private getResources;
    private getHttpResponse;
    private reverseDns;
    private dnsLookup;
    private validateRecordSet_A_CNAME;
    private validateRecordSet_MX;
    private validateRecordSet;
    private saveToFile;
}
