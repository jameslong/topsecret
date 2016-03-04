declare module "dynamodb-doc" {
        export interface Error {
                code: string;
                message: string;
        }

        export interface GetItemParams {
                Key: Object;
                TableName: string;
        }

        export interface PutItemParams {
                Item: any;
                TableName: string;
                ReturnValues?: string;
        }

        export interface UpdateItemParams {
                Key: Object;
                TableName: string;
        }

        export interface DeleteItemParams {
                Key: Object;
                TableName: string;
        }

        export interface RequestFn<T, U> {
                (params: T, callback: (error: Error, data: U) => void) : void;
        }

        export class DynamoDB {
                Condition: <T>(name: string, op: string, value: T) => Object;
                batchWriteItem: RequestFn<any, any>;
                createTable: RequestFn<any, any>;
                deleteItem: RequestFn<DeleteItemParams, any>;
                deleteTable: RequestFn<any, any>;
                getItem: RequestFn<GetItemParams, any>;
                scan: RequestFn<any, any>;
                putItem: RequestFn<PutItemParams, any>;
                updateItem: RequestFn<UpdateItemParams, any>;
                query: RequestFn<any, any>;
        }
}
