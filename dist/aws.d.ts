export declare class AWS {
    private r53;
    private s3;
    getDomains(): Promise<string[]>;
    saveFileToS3(bucket: string, filename: string, data: object): Promise<{}>;
    private getZones;
    private getResources;
}
