import React from "react";

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
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
                <div className="bg-gray-200 w-36 h-12 my-2">1234</div>
            </div>
        </>
    );
}

function Listener() {}
