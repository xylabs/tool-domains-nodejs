import { Config } from './config';
export declare class XyDomainScan {
    private aws;
    private config;
    start(config?: Config): Promise<any>;
    private addAWSDomains;
    private addDomains;
    private saveToFile;
}
