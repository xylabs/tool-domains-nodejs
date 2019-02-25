export declare class XyDomainScan {
    private r53;
    private getZones;
    private getResources;
    private getHttpResponse;
    private getHttpsResponse;
    private validateRecordSet_A_CNAME;
    private validateRecordSet_MX;
    private validateRecordSet;
    private saveToFile;
    start(): Promise<void>;
}
