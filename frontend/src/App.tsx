import React, { useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import LobbyList from "./components/3d/LobbyList";

function App() {
    const searchTextRef = useRef("");
    return (
        <div className="App">
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <div className="pl-4 text-white">
                    <Link to="/login">Login</Link>
                </div>
                <input
                    className="bg-gray-600 text-white flex-grow max-w-lg mx-8 w-72 px-4 rounded-full"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => {
                        searchTextRef.current = e.target.value;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && searchTextRef.current) {
                            console.log(searchTextRef.current);
                            // TODO: Add proper search
                        }
                    }}
                />
                <div className="pr-4 text-white">
                    {/* TODO: Add a link to the lobby creation page */}
                    <Link to="/">Lit Camp Fire</Link>
                </div>
            </nav>
            {/* TODO: Provide load functions */}
            <LobbyList loadNextFunc={() => {}} loadPrevFunc={() => {}} />
        </div>
    );
}

export default App;
