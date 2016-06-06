declare module "dynamodb-doc" {
        export interface Error {
                code: string;
                message: string;
        }

        export interface GetParams {
                Key: Object;
                TableName: string;
        }

        export interface PutParams {
                Item: any;
                TableName: string;
                ReturnValues?: 'NONE' | 'ALL_OLD';
        }

        export interface UpdateParams {
                Key: Object;
                TableName: string;
        }

        export interface DeleteParams {
                Key: Object;
                TableName: string;
                ReturnValues?: 'NONE' | 'ALL_OLD';
        }

        export interface ScanParams {
                Limit : number;
                TableName: string;
                ExclusiveStartKey?: Object;
        }

        export interface RequestFn<T, U> {
                (params: T, callback: (error: Error, data: U) => void) : void;
        }

        export class DynamoDB {
                put: RequestFn<PutParams, any>;
                batchWrite: RequestFn<any, any>;
                delete: RequestFn<DeleteParams, any>;
                get: RequestFn<GetParams, any>;
                scan: RequestFn<ScanParams, any>;
                update: RequestFn<UpdateParams, any>;
                query: RequestFn<any, any>;
        }
}
