import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Listeners from "../components/lobby/Listeners";

interface PropsType {}

export default function Lobby(props: PropsType) {
    const lobbyId = useParams().lobbyId;
    const navigate = useNavigate();
    console.log(lobbyId);
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
            <div className="bg-green-200 absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                123
            </div>
            <div className="bg-green-200 absolute top-1/4 left-[80%] flex flex-col justify-center items-center max-h-72">
                <Listeners userList={[]} />
            </div>
        </div>
    );
}
