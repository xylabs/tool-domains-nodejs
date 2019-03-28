import { MasterConfig } from './config';
import { MasterValidator } from './validator/master';
export declare class XyDomainScan {
    private aws;
    private config;
    private validator;
    private preflight?;
    loadConfig(filename?: string): Promise<any>;
    start(params: {
        output: string;
        singleDomain?: string;
        bucket?: string;
        config?: MasterConfig;
        preflight?: string;
    }): Promise<MasterValidator>;
    private getLatestS3FileName;
    private getHistoricS3FileName;
    private saveToAws;
    private saveToFile;
}
