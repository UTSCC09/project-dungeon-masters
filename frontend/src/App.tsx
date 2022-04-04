import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import LobbyList from "./components/3d/LobbyList";

import staticData from "./assets/staticData/lobbies";
import { useCookies } from "react-cookie";
import { UserApi } from "./api/userApi";
import { CampfireApi, CampfireFields } from "./api/campfiresApi";
import { AuthenticationApi } from "./api/authenticationApi";

function App() {
    const searchTextRef = useRef("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [cookies, setCookie, removeCookie] = useCookies(["username"]);
    const [lobbies, setLobbies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const isLoggedin = cookies.username && cookies.username !== "";
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    function onLogOut(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        AuthenticationApi.signOut();
        removeCookie("username");
    }

    function loadRecentLobbies() {
        CampfireApi.queryCampfires(
            false,
            false,
            [
                CampfireFields.id,
                CampfireFields.ownerUsername,
                CampfireFields.title,
                CampfireFields.description,
                CampfireFields.status,
                CampfireFields.followers,
                CampfireFields.thumbnail,
            ],
            page
        )
            .then((res) => {
                if (res) {
                    return res.json();
                } else {
                    throw new Error("Response is null");
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
                setErrorMessage(String(e));
            });
    }

    function onSearch(text: string) {
        console.log(text);
        setLobbies([]);
        CampfireApi.queryCampfiresByTitle(
            text,
            false,
            false,
            [
                CampfireFields.id,
                CampfireFields.ownerUsername,
                CampfireFields.title,
                CampfireFields.description,
                CampfireFields.status,
                CampfireFields.followers,
                CampfireFields.thumbnail,
            ],
            page
        )
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
                setErrorMessage(String(e));
            });
    }

    useEffect(() => {
        if (!isLoggedin) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (searchTextRef.current === "") {
            loadRecentLobbies();
        } else {
            onSearch(searchTextRef.current);
        }
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
                <div className="bg-gray-600 text-white flex-grow max-w-lg w-72 rounded-full flex flex-row">
                    <input
                        ref={searchInputRef}
                        className="bg-gray-600 text-white w-full px-4 rounded-full"
                        type="text"
                        placeholder="Search"
                        onChange={(e) => {
                            searchTextRef.current = e.target.value;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && searchTextRef.current) {
                                setPage(0);
                                onSearch(searchTextRef.current);
                            }
                        }}
                    />
                    {/* Display this only if the search bar has text */}
                    {searchTextRef.current && (
                        <button
                            className="right-0 mr-2 w-6 -ml-8 bg-cover grayscale"
                            style={{ backgroundImage: "url(remove.png)" }}
                            onClick={() => {
                                if (searchInputRef.current) {
                                    searchInputRef.current.value = "";
                                }
                                searchTextRef.current = "";
                                setPage(0);
                                onSearch("");
                            }}
                        ></button>
                    )}
                </div>
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
            {errorMessage === "" ? null : (
                <div className="bg-red-100 text-center text-lg">
                    {errorMessage}
                </div>
            )}
            <LobbyList
                lobbies={lobbies}
                navigateFunc={navigate}
                loadPrevFunc={() => setPage(page - 1)}
                loadNextFunc={() => setPage(page + 1)}
                page={page}
            />
        </div>
    );
}

export default App;
