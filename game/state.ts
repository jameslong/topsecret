import DBTypes = require('./dbtypes');
import Kbpgp = require('./kbpgp');
import Map = require('./utils/map');
import Message = require('./message');
import Profile = require('./profile');
import Request = require('./requesttypes');

export interface GameData {
        name: string;
        keyManagers: Kbpgp.KeyManagers
        profiles: Map.Map<Profile.Profile>;
        threadData: Map.Map<Message.ThreadMessage>;
        strings: Map.Map<string>;
}

export interface State {
        emailDomain: string;
        timeFactor: number;
        immediateReplies: boolean;
        data: Map.Map<GameData>;
        send: (
                data: Message.MessageData,
                callback: Request.Callback<string>) => void;
        db: DBTypes.DBCalls;
}
