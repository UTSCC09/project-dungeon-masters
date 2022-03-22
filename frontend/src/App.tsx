import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import LobbyList from "./components/3d/LobbyList";

import staticData from "./assets/staticData/lobbies";
import { useCookies } from "react-cookie";

function App() {
    const searchTextRef = useRef("");
    const [cookies, setCookie, removeCookie] = useCookies(["username"]);
    const [lobbies, setLobbies] = useState([]);
    const isLoggedin = cookies.username && cookies.username !== "";

    function onLogOut(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        fetch("http://localhost:4000/graphql/", {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation SignOut {
                        signOut {
                            username
                        }
                    }
                `,
            }),
        });
        removeCookie("username");
    }

    function loadRecentLobbies() {
        fetch("http://localhost:4000/graphql/", {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                  query QueryCampfires($owned: Boolean, $follower: Boolean) {
                    campfires(owned: $owned, follower: $follower) {
                      _id
                      ownerUsername
                      title
                      description
                      status
                      followers
                      thumbnail
                    }
                  }
                `,
                variables: {
                    owned: true,
                    follower: false,
                },
            }),
        })
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
                                // url: item.url
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

    useEffect(() => {
        loadRecentLobbies();
    }, []);

    return (
        <div className="App">
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <div className="pl-4 text-white">
                    {isLoggedin ? (
                        <Link to="/profile">{`Welcome back, ${cookies.username}`}</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                    {isLoggedin ? (
                        <Link to="/lobby/12345">Test lobby</Link>
                    ) : null}
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
                loadPrevFunc={() => {}}
                loadNextFunc={() => {}}
            />
        </div>
    );
}

export default App;
