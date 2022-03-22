import React, { useState } from "react";

interface User {
    username: string;
}

interface PropsType {
    userList: User[];
}

export default function Listeners(props: PropsType) {
    const { userList } = props;
    return (
        <>
            <div className="bg-red-300 w-56 h-16 rounded-lg relative flex items-center px-4">
                <div className="flex-grow">Listeners</div>
                <div className="">{userList.length}</div>
            </div>
            <div className="overflow-auto">
                {userList.map((item, index) => {
                    return (
                        <Listener
                            key={index}
                            username={item.username}
                            muteHandler={(isNowMuted) => {
                                if (isNowMuted) {
                                    // Do something
                                } else {
                                    // Do some other things
                                }
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

function Listener(props: {
    username: string;
    muteHandler: (isNowMuted: boolean) => void; // A function to be called when mute / unmute is clicked.
}) {
    const { username, muteHandler } = props;
    const [muted, setMuted] = useState(false);

    return (
        <div className="bg-gray-300 w-48 h-12 my-2 flex flex-row items-center rounded-lg px-4">
            <div className="flex-grow">{username}</div>
            <button
                className="text-red-700"
                onClick={(e) => {
                    e.preventDefault();
                    muteHandler(muted);
                    setMuted(!muted);
                }}
            >
                {muted ? "Unmute" : "Mute"}
            </button>
        </div>
    );
}
