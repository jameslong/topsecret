export interface ConfigData {
        emailDomain: string;
        immediateReplies: boolean;
        timeFactor: number;
        serverURL: string;
        version: string;
        beginGameMessage: string;
}

export const config: ConfigData = {
        emailDomain: 'nsa.gov',
        immediateReplies: false,
        timeFactor: 1,
        serverURL: 'http://127.0.0.1:3000',
        version: 'test_data',
        beginGameMessage: 'reply_expired',
}
