import Peer from "simple-peer";
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    roomfull: () => void;
    allusers: (users:string[]) => any;
    userjoined: (payload: ReceivePayload) => any;
    receivingreturnedsignal: (payload: ReceiveReturnPayload) => any;
  }
  
export interface ClientToServerEvents {
    hello: () => void;
    sendingsignal: (payload: SendPayload) => any;
    returningsignal: (payload: ReturnPayload) => void;
    disconnect: () => void;
    joinroom: (lobbyId: string) => any;
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
    callerId: string; // the 
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