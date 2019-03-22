import { Config } from './config';
export declare class XyDomainScan {
    private aws;
    private config;
    start(output: string, singleDomain?: string, config?: Config): Promise<any>;
    private addAWSDomains;
    private addDomains;
    private saveToFile;
}
