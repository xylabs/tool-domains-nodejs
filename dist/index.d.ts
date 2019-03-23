import { Config } from './config';
export declare class XyDomainScan {
    private aws;
    private config;
    start(params: {
        output: string;
        singleDomain?: string;
        bucket?: string;
        config?: Config;
    }): Promise<any>;
    private getLatestS3FileName;
    private getHistoricS3FileName;
    private addAWSDomains;
    private addDomains;
    private saveToFile;
}
