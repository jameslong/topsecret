declare module "body-parser" {
        export function json(): string;
        export function urlencoded(params: { extended: boolean }): string;
}
