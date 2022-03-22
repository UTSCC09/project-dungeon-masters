import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackGround3D from "../components/3d/BackGround3D";
import Listeners from "../components/lobby/Listeners";

const staticListeners = [
    {
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
        url: "/next.png",
    },
    {
        url: "/next2.png",
    },
];

interface PropsType {}

export default function Lobby(props: PropsType) {
    const lobbyId = useParams().lobbyId;
    const navigate = useNavigate();
    const [status, setStatus] = useState(0);
    const [listeners, setListeners] = useState(staticListeners);
    const [images, setImages] = useState(staticImages);
    const [selected, setSelected] = useState(0);
    return (
        <div className="">
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <div className="text-white">
                    <button
                        className="h-5 w-15 ml-5 pl-8 text-black btn invert"
                        style={{ backgroundImage: `url(/back.png)` }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/");
                        }}
                    ></button>
                </div>
            </nav>
            <BackGround3D
                autoRotate={false}
                path="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg/1600px-Plate_Carr%C3%A9e_with_Tissot%27s_Indicatrices_of_Distortion.svg.png"
            />
            <div className="bg-green-200 absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 pt-2 pb-1 rounded-xl">
                <div className="text-center w-full">Lobby Name</div>
                <div>
                    <button
                        className="bg-red-200 px-2 py-1 rounded-l-full w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            setStatus(0);
                            // TODO: API
                        }}
                    >
                        Talking
                    </button>
                    <button
                        className="bg-red-300 px-2 py-1 w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            setStatus(1);
                            // TODO: API
                        }}
                    >
                        Telling
                    </button>
                    <button
                        className="bg-red-400 px-2 py-1 rounded-r-full w-16"
                        onClick={(e) => {
                            e.preventDefault();
                            setStatus(2);
                            // TODO: API
                        }}
                    >
                        Ending
                    </button>
                </div>
                <div className="text-center w-full text-xs">
                    status: {["Talking", "Telling", "Ending"][status]}
                </div>
            </div>
            <div className="bg-green-200 absolute top-1/4 left-[80%] flex flex-col justify-center items-center max-h-72">
                <Listeners userList={listeners} />
            </div>
            <div className="absolute bottom-0 bg-gray-900 h-1/4 w-full text-white flex flex-row">
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
