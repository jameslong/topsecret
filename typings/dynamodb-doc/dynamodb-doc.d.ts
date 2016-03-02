declare module "dynamodb-doc" {
        export interface Error {
                code: string;
                message: string;
        }

        export interface RequestFn {
                <T>(params: Object, callback: (error: Error, data: T) => void)
                : void;
        }

        export class DynamoDB {
                Condition: <T>(name: string, op: string, value: T) => Object;
                batchWriteItem: RequestFn;
                createTable: RequestFn;
                deleteItem: RequestFn;
                deleteTable: RequestFn;
                getItem: RequestFn;
                scan: RequestFn;
                putItem: RequestFn;
                updateItem: RequestFn;
                query: RequestFn;
        }
}
