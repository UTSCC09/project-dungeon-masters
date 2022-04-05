import Peer from "simple-peer";
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    error: (message: string) => void;
    allusers: (users:follower[]) => any;
    userjoined: (payload: ReceivePayload) => any;
    receivingreturnedsignal: (payload: ReceiveReturnPayload) => any;
    userleft: (id: string) => any;
    ownerleft: (id: string, message:string) => any;
    changeImg: (index: number) => void;
    playSFX: (url:string) => any;
  }

export interface ClientToServerEvents {
    hello: () => void;
    sendingsignal: (payload: SendPayload) => any;
    returningsignal: (payload: ReturnPayload) => void;
    disconnect: () => void;
    joinroom: (lobbyId: string) => any;
    narratorText: (message: string) => any;
    startGoogleCloudStream: () => void;
    binaryAudioData: (data: any) => void;
    endGoogleCloudStream: () => void;
    changeImg: (index: number) => void;
  }

export interface InterServerEvents {
    ping: () => void;
  }

export interface SocketData {
    name: string;
    age: number;
  }

export interface SendPayload {
    userToSignal: string; // which users to send signal to
    callerID: string; // the
    signal: Peer.SignalData;

}

export interface ReceivePayload {
    signal: Peer.SignalData;
    callerID: string;
    stream: MediaStream;
}

export interface peersRefType {
    peerId: string;
    peer: Peer.Instance;
}

export interface ReturnPayload {
    signal: Peer.SignalData;
    callerID: string;
}

export interface ReceiveReturnPayload {
    signal: Peer.SignalData;
    id: string;
}

export interface PeerVidProp {
    peer: Peer.Instance;
}

export interface follower{
  socketId: string;
  username: string;
}

export interface OwnerLeftPayload{
  id: string;
  message:string;
}
