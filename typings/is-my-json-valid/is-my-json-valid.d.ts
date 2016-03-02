declare module "is-my-json-valid" {
        interface ValidateFn<T> {
                (object: T): boolean;
                errors: Object[];
        }

        function validator<T>(schema: Object): ValidateFn<T>;

        export = validator;
}
