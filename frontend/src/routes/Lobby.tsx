import { Slider, useRadioGroup } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampfireApi } from "../api/campfiresApi";
import BackGround3D from "../components/3d/BackGround3D";
import Listeners from "../components/lobby/Listeners";
import {io, Socket} from "socket.io-client";
import {ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, SendPayload, ReceivePayload, peersRefType, ReceiveReturnPayload, PeerVidProp, ReturnPayload} from "../components/lobby/socketsInterfaces";
//import "../components/lobby/socketsInterfaces";
import Peer from "simple-peer";

const staticListeners = [
    "aquil",
    "Artina",
    "Wilson",
    "Yiyang",
    "Test1",
    "Test2",
];

const staticImages = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
];

const statusIndex = ["Preparing", "Talking", "Telling", "Ending"];

interface PropsType {}

function PeerVideo(props: PeerVidProp){
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        props.peer.on("stream", stream => {
            console.log("streaming", stream);
            ref.current!.srcObject = stream;
        })
    }, []);

    return (
        <video hidden autoPlay playsInline ref={ref}></video> 
    );
}

export default function Lobby(props: PropsType) {
    const lobbyId = useParams().lobbyId || "";
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isNarrator, setIsNarrator] = useState(false);

    //for webRTC
    const userStream = useRef<HTMLVideoElement>(null);
    const [peers, setPeers] = useState<Peer.Instance[]>([]);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
    const peersRef = useRef<peersRefType[]>([]); // array of socket id to a listener object
    // also need lobbyID I think

    if (lobbyId === "") {
        setErrorMessage("Lobby ID is empty.");
    }

    function handleExitLobby() {
        // TODO: Send exit lobby request to server
        navigate("/");
    }

    function createPeer(userToSignal: string, callerId: string, stream: MediaStream){
        //caller Id is the socket id of this client, userToSignal is the id of other users
        const peer = new Peer({
            initiator: true, // upon construction, a signal got sent out
            trickle: false,
            stream
        });
        console.log("create other user peer for this client, stream",stream);

        peer.on("signal", signal => {
            if(socketRef.current)
            socketRef.current.emit("sendingsignal", {userToSignal, callerId, signal});
        });

        return peer;
    }

    function addPeer(incomingSignal: Peer.SignalData, callerId: string, stream: MediaStream){
        // the person that joined the room notifies this client, and received the incomingSignal
        // now the client send their signal back to the new joined user
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        console.log("add new join peer for this client, stream",stream);

        peer.on("signal", signal => {
            if(socketRef.current)
            socketRef.current.emit("returningsignal", {signal, callerID: callerId});
        })

        peer.signal(incomingSignal);
        return peer;
    }

    useEffect(() => {
        CampfireApi.getCampfireRole(lobbyId)
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    throw new Error("Response is null");
                }
            })
            .then((json) => {
                console.log(json);
                if (!json.errors) {
                    const role = json.data.getCampfireRole;
                    setIsNarrator(role === "owner");
                    console.log("1. setting io, initiating connection");
                    // create websocket between server and client when joining the room
                    socketRef.current = io("http://localhost:4000/", 
                        {withCredentials: true,
                        extraHeaders:{
                           "cfstorylobby": lobbyId
                        }
                    });
                    socketRef.current.connect();
                    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream =>{
                        userStream.current!.srcObject = stream;
                        console.log("my stream", userStream.current!.srcObject);
                        if(socketRef.current){
                            socketRef.current.emit("joinroom", lobbyId);
                            socketRef.current.on("allusers", users => {
                                users.forEach(userId => {
                                    //userid is the socket id for that client
                                    const peer = createPeer(userId, socketRef.current!.id, stream);
                                    peersRef.current.push({
                                        peerId: userId,
                                        peer,
                                    })
                                    setPeers([...peers,peer]);
                                });
                            });

                            // whenever a listener joins
                            socketRef.current.on("userjoined", (payload) => {
                                console.log("user joined, adding this new user in");
                                const peer = addPeer(payload.signal, payload.callerID, stream);
                                peersRef.current.push({
                                    peerId: payload.callerID,
                                    peer,
                                });

                                setPeers([...peers, peer]);
                            });

                            socketRef.current.on("receivingreturnedsignal", payload => {
                                const item = peersRef.current.find(p => p.peerId === payload.id);
                                item?.peer.signal(payload.signal);
                            });
                        }
                    });
                } else {
                    throw new Error(json.errors[0].message);
                }
            })
            .catch((e) => {
                setErrorMessage(String(e));
            });
        return () => {
            // Unsubscribe from events
        };
    }, []);

    return (
        <div className="">
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <div className="text-white">
                    <button
                        className="h-5 w-15 ml-5 pl-8 text-black btn invert"
                        style={{ backgroundImage: `url(/back.png)` }}
                        onClick={(e) => {
                            e.preventDefault();
                            handleExitLobby();
                        }}
                    ></button>
                </div>
            </nav>
            {/* this client's call, where userStream is set */}
            <video hidden muted autoPlay playsInline ref={userStream}></video> 
            {peers.map((peer, index) => {
                return (
                    <PeerVideo key={index} peer={peer} />
                );
            })}
            {errorMessage !== "" ? (
                <div className="bg-red-200 absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded">
                    <div>{errorMessage}</div>
                    <button
                        className="absolute right-0 top-0 bg-red-600 rounded-full translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cover"
                        style={{ backgroundImage: `url(/remove.png)` }}
                        onClick={(e) => {
                            e.preventDefault();
                            setErrorMessage("");
                        }}
                    ></button>
                </div>
            ) : null}
            {isNarrator ? (
                <NarratorView
                    lobbyId={lobbyId}
                    errorHandler={setErrorMessage}
                />
            ) : (
                <ListenerView
                    lobbyId={lobbyId}
                    errorHandler={setErrorMessage}
                />
            )}
        </div>
    );
}

function NarratorView(props: {
    lobbyId: string;
    errorHandler: (message: string) => void;
}) {
    const { lobbyId, errorHandler } = props;
    const [status, setStatus] = useState(0);
    const [listeners, setListeners] = useState([]);
    const [images, setImages] = useState([]);
    const [selected, setSelected] = useState(0);


    function handleStatusChange(oldStatus: number, newStatus: number) {
        setStatus(newStatus);
        // TODO: Send status change to server
    }

    useEffect(() => {
        CampfireApi.getCampfireStatusAndAssets(lobbyId)
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    throw new Error("Response is null");
                }
            })
            .then((json) => {
                console.log(json);
                if (!json.errors) {
                    setStatus(
                        statusIndex
                            .map((item) => item.toLowerCase())
                            .indexOf(json.data.campfires[0].status)
                    );
                    setListeners(json.data.campfires[0].followers);
                    setImages(json.data.campfires[0].scenes);
                } else {
                    throw new Error(json.errors[0].message);
                }
            })
            .catch((e) => {
                errorHandler(String(e));
            });
    }, []);

    return (
        <>
            <BackGround3D autoRotate={false} path={images[selected]} />
            <div className="bg-green-200 absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 pt-2 pb-1 rounded-xl">
                <div className="text-center w-full">Lobby Name</div>
                <div>
                    <button
                        className="bg-red-100 px-2 py-1 rounded-l-full w-20"
                        onClick={(e) => {
                            e.preventDefault();
                            handleStatusChange(status, 0);
                        }}
                    >
                        Preparing
                    </button>
                    <button
                        className="bg-red-200 px-2 py-1 w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            handleStatusChange(status, 1);
                        }}
                    >
                        Talking
                    </button>
                    <button
                        className="bg-red-300 px-2 py-1 w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            handleStatusChange(status, 2);
                        }}
                    >
                        Telling
                    </button>
                    <button
                        className="bg-red-400 px-2 py-1 rounded-r-full w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            handleStatusChange(status, 3);
                        }}
                    >
                        Ending
                    </button>
                </div>
                <div className="text-center w-full text-xs">
                    status: {statusIndex[status]}
                </div>
            </div>
            <div className="bg-green-200 absolute top-1/4 left-[80%] flex flex-col justify-center items-center max-h-72 rounded-lg">
                <Listeners userList={listeners} />
            </div>
            <div className="absolute bottom-0 bg-gray-900 h-1/4 w-full text-white flex flex-row overflow-auto">
                {images.map((item, index) => {
                    return (
                        <img
                            className={
                                "mx-2 border-solid " +
                                (index === selected
                                    ? "border-4 border-green-400"
                                    : "")
                            }
                            onClick={(e) => {
                                e.preventDefault();
                                // TODO: Broadcast to listeners
                                setSelected(index);
                            }}
                            key={index}
                            src={item}
                            alt={"Slide #" + index}
                        />
                    );
                })}
            </div>
        </>
    );
}

function ListenerView(props: {
    lobbyId: string;
    errorHandler: (message: string) => void;
}) {
    const { lobbyId, errorHandler } = props;
    const [status, setStatus] = useState(0);
    const [listeners, setListeners] = useState([]);
    const [images, setImages] = useState([]);
    const [muted, setMuted] = useState(false);
    const [speakerMuted, setSpeakerMuted] = useState(false);
    const [showTools, setShowTools] = useState(true);

    useEffect(() => {
        CampfireApi.getCampfireStatusAndAssets(lobbyId)
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    throw new Error("Response is null");
                }
            })
            .then((json) => {
                console.log(json);
                if (!json.errors) {
                    setStatus(
                        statusIndex
                            .map((item) => item.toLowerCase())
                            .indexOf(json.data.campfires[0].status)
                    );
                    setListeners(json.data.campfires[0].followers);
                    setImages(json.data.campfires[0].scenes);
                } else {
                    throw new Error(json.errors[0].message);
                }
            })
            .catch((e) => {
                errorHandler(String(e));
            });
    }, []);
    return (
        <>
            <div>
                <BackGround3D autoRotate={false} path={images[0]} />
                {showTools ? (
                    <div className="absolute bottom-0 bg-gray-900 h-1/4 w-full text-white flex flex-row items-center justify-between">
                        <div className="w-[15%] bg-gray-700 overflow-auto pr-6">
                            {listeners.map((item, index) => {
                                return (
                                    <div className="grid grid-cols-2 text-center">
                                        {item}
                                        <Slider
                                            size="small"
                                            defaultValue={70}
                                            aria-label="Small"
                                            valueLabelDisplay="auto"
                                            onChange={(e, value) => {
                                                // Handler volume change
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-[20%] pr-6">
                            <div className="grid grid-cols-2 grid-rows-2 text-center">
                                Narrator
                                <Slider
                                    size="small"
                                    defaultValue={70}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                    onChange={(e, value) => {
                                        // Handler volume change
                                    }}
                                />
                                Sound Effects
                                <Slider
                                    size="small"
                                    defaultValue={70}
                                    aria-label="Small"
                                    valueLabelDisplay="auto"
                                    onChange={(e, value) => {
                                        // Handler volume change
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row">
                            <button
                                className="bg-cover invert w-16 h-16 rounded-full border-solid border-4 border-black mx-4"
                                style={{
                                    backgroundImage: muted
                                        ? `url(/mute.png)`
                                        : `url(/microphone.png)`,
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMuted(!muted);
                                }}
                            ></button>
                            <button
                                className="bg-cover invert w-16 h-16 mx-4"
                                style={{
                                    backgroundImage: speakerMuted
                                        ? `url(/mute_speaker.png)`
                                        : `url(/speaker.png)`,
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSpeakerMuted(!speakerMuted);
                                }}
                            ></button>
                        </div>
                        <button
                            className="absolute top-0 right-0 bg-cover w-8 h-8 invert mr-6 mt-2"
                            style={{
                                backgroundImage: `url(/arrow-down-sign-to-navigate.png)`,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowTools(!showTools);
                            }}
                        ></button>
                    </div>
                ) : (
                    <div className="absolute right-0 bottom-0 bg-cover mr-6 bg-gray-900 rounded-t-xl px-4">
                        <button
                            className="invert bg-cover w-8 h-8"
                            style={{
                                backgroundImage: `url(/arrow-up-sign-to-navigate.png)`,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowTools(!showTools);
                            }}
                        ></button>
                    </div>
                )}
            </div>
        </>
    );
}
