import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CampfireApi } from "../api/campfiresApi";
import BackGround3D from "../components/3d/BackGround3D";
import Listeners from "../components/lobby/Listeners";

const staticListeners = [
    {
        // Can add more fields here.
        username: "aquil",
    },
    {
        username: "Artina",
    },
    {
        username: "Wilson",
    },
    {
        username: "Yiyang",
    },
    {
        username: "Test1",
    },
    {
        username: "Test2",
    },
];

const staticImages = [
    {
        // Can add more fields (name, etc) if needed.
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
    },
    {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BlankMap-Equirectangular.svg/1280px-BlankMap-Equirectangular.svg.png",
    },
];

interface PropsType {}

export default function Lobby(props: PropsType) {
    const lobbyId = useParams().lobbyId || "";
    const navigate = useNavigate();
    const [status, setStatus] = useState(0);
    const [listeners, setListeners] = useState(staticListeners);
    const [images, setImages] = useState(staticImages);
    const [selected, setSelected] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    if (lobbyId === "") {
        setErrorMessage("Lobby ID is empty.");
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
                if (!json.errors) {
                    // setStatus(json.data.???);
                    // setListeners(json.data.???);
                    // setImages(json.data.???);
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

    function handleStatusChange(oldStatus: number, newStatus: number) {
        setStatus(newStatus);
        // TODO: Send status change to server
    }

    function handleExitLobby() {
        // TODO: Send exit lobby request to server
        navigate("/");
    }

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
            <BackGround3D autoRotate={false} path={images[selected].url} />
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
                    status:{" "}
                    {["Preparing", "Talking", "Telling", "Ending"][status]}
                </div>
            </div>
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
            <div className="bg-green-200 absolute top-1/4 left-[80%] flex flex-col justify-center items-center max-h-72">
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
                                // Broadcast to listeners
                                setSelected(index);
                            }}
                            key={index}
                            src={item.url}
                        />
                    );
                })}
            </div>
        </div>
    );
}
