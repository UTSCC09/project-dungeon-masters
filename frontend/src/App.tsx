import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import LobbyList from "./components/3d/LobbyList";

import staticData from "./assets/staticData/lobbies";
import { useCookies } from "react-cookie";
import { UserApi } from "./api/userApi";
import { CampfireApi, CampfireFields } from "./api/campfiresApi";
import {AuthenticationApi} from "./api/authenticationApi";

function App() {
    const searchTextRef = useRef("");
    const [cookies, setCookie, removeCookie] = useCookies(["username"]);
    const [lobbies, setLobbies] = useState([]);
    const isLoggedin = cookies.username && cookies.username !== "";
    const navigate = useNavigate();
    const [page, setPage] = useState(0);


    function onLogOut(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        AuthenticationApi.signOut();
        removeCookie("username");
    }
    function loadRecentLobbies() {
        CampfireApi.queryCampfires(false, false, [
            CampfireFields.id,
            CampfireFields.ownerUsername,
            CampfireFields.title,
            CampfireFields.description,
            CampfireFields.status,
            CampfireFields.followers,
            CampfireFields.thumbnail,
        ], page)
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    throw new Error("Invalid username or password!");
                }
            })
            .then((json) => {
                if (!json.errors) {
                    setLobbies(
                        json.data.campfires.map((item: any) => {
                            return {
                                campfireId: item._id,
                                ownerId: item.ownerUsername,
                                title: item.title,
                                description: item.description,
                                thumbnail: item.thumbnail,
                            };
                        })
                    );
                } else {
                    throw new Error(json.errors[0].message);
                }
            })
            .catch((e) => {
                // setErrorMessage(String(e));
            });
    }

    useEffect(() =>{
        if(!isLoggedin){
            navigate("/login");
        }
        // loadRecentLobbies();
    }, []);

    useEffect(() => {
        loadRecentLobbies();
    }, [page]);

    return (
        <div className="App">
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <div className="pl-4 text-white">
                    {isLoggedin ? (
                        <Link to="/profile">{`Welcome back, ${cookies.username}`}</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
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
                    {isLoggedin ? (
                        <a
                            className="mr-6"
                            href="#"
                            onClick={(e) => onLogOut(e)}
                        >
                            Log out
                        </a>
                    ) : null}
                    {isLoggedin && <Link to="/addCampfire">Lit Camp Fire</Link>}
                </div>
            </nav>
            <LobbyList
                lobbies={lobbies}
                navigateFunc={navigate}
                loadPrevFunc={() => setPage(page-1)}
                loadNextFunc={() => setPage(page+1)}
                page={page}
            />
        </div>
    );
}

export default App;
