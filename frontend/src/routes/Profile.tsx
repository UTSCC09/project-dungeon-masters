import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import staticData from "../assets/staticData/lobbies";

interface PropsType {}

export default function Profile(props: PropsType) {
    // Dummy data. TODO: fetch from endpoint
    const [cookies] = useCookies(["username"]);
    let [username, setUsername] = useState(cookies.username || "");
    let [links, setLinks] = useState(["", ""]);
    let [description, setDescription] = useState("");
    let since = "1970/1/1";
    let [lobbies, setLobbies] = useState(staticData);

    const navigate = useNavigate();
    const [edit, setEdit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");

    function getUserInfoFromAPI() {
        fetch("http://localhost:4000/graphql/", {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    query QueryUsers {
                      users {
                        description
                        socialMedia {
                          twitter,
                          instagram
                        }
                      }
                    }
                `,
                variables: {},
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
                    //{
                    //   "data": {
                    //     "users": [
                    //       {
                    //         "description": "",
                    //         "socialMedia": {
                    //           "twitter": "",
                    //           "instagram": ""
                    //         }
                    //       }
                    //     ]
                    //   }
                    // }
                    console.log(json);
                    setLinks([
                        json.data.users[0].socialMedia.twitter,
                        json.data.users[0].socialMedia.instagram,
                    ]);
                    setDescription(json.data.users[0].description || "");
                    // setLobbies();
                } else {
                    throw new Error(json.errors[0].message);
                }
            })
            .catch((e) => {
                setErrorMessage(String(e));
            });
    }

    function updateUserInfo(socialLinks: string[], description: string) {
        fetch("http://localhost:4000/graphql/", {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation ModifyUser($userData: UserInputObject){
                      modifyUser(userData: $userData) {
                        description
                        socialMedia {
                          twitter,
                          instagram
                        }
                      }
                    }
                `,
                variables: {
                    userData: {
                        description: description,
                        socialLinks: {
                            twitter: socialLinks[0],
                            instagram: socialLinks[1],
                        },
                    },
                },
            }),
        });
        //Returns
        // {
        //     "data": {
        //     "modifyUser": {
        //         "description": "bob",
        //             "socialMedia": {
        //             "twitter": "4",
        //                 "instagram": null
        //         }
        //     }
        //   }
        // }
    }

    useEffect(() => {
        getUserInfoFromAPI();
    }, []);

    return (
        <>
            <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <button
                    className="w-6 h-6 ml-4 bg-cover invert"
                    style={{ backgroundImage: `url(/left-arrow.png)` }}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/");
                    }}
                ></button>
            </nav>
            {errorMessage === "" ? null : (
                <div className="bg-red-100 text-center text-lg">
                    {errorMessage}
                </div>
            )}
            {!edit ? (
                <UserInfoDisplay
                    username={username}
                    links={links}
                    description={description}
                    since={since}
                    handler={(e) => {
                        e.preventDefault();
                        setEdit(true);
                    }}
                />
            ) : (
                <UserInfoEdit
                    username={username}
                    links={links}
                    description={description}
                    since={since}
                    onConfirm={(e, socialLinks, description) => {
                        e.preventDefault();
                        // TODO: Update user profile in the database
                        updateUserInfo(socialLinks, description);
                        setEdit(false);
                        setLinks(socialLinks);
                        setDescription(description);
                    }}
                    onCancel={(e) => {
                        e.preventDefault();
                        setEdit(false);
                    }}
                />
            )}
            <p className="ml-6 mt-4 font-bold text-2xl">
                Recently Joined Camp Fires
            </p>
            <div className="flex flex-row flex-wrap">
                {lobbies.map((item, index) => {
                    return (
                        <div key={index} className="w-1/3 px-4 pb-8">
                            <div className="relative h-full bg-white border-gray-800 border-solid border-4 text-gray-800 px-8 pt-4 pb-4 mt-4 rounded-2xl">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // TODO: Navigate to the correct lobby
                                        navigate("/");
                                    }}
                                    className="font-bold underline text-center text-3xl mb-4"
                                >
                                    {item.title}
                                </button>
                                <h1 className="font-semibold text-lg mb-1">
                                    {item.ownerId}
                                </h1>
                                <div className="flex flex-row flex-grow mt-3 mb-8">
                                    <div className=" border-solid border-gray-400 border-r-4 mr-2"></div>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

function UserInfoDisplay(props: {
    username: string;
    links: string[];
    description: string;
    since: string;
    handler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const { username, links, description, since, handler } = props;
    return (
        <div className="relative bg-gray-800 text-white w-auto px-8 pt-4 pb-4 mt-4 mx-4 rounded-2xl">
            <h2 className="font-bold text-3xl mb-4">{username}</h2>
            <h1 className="font-semibold text-lg mb-1">Social Medias</h1>
            <ul className="list-disc italic ml-4">
                {links.map((item, index) => {
                    if (item === "") return;
                    return (
                        <li key={index}>
                            <a href={item} className="underline">
                                {item}
                            </a>
                        </li>
                    );
                })}
            </ul>
            <div className="flex flex-row flex-grow mt-3 mb-8">
                <div className=" border-solid border-gray-400 border-r-4 mr-2"></div>
                <p>{description}</p>
            </div>
            <p className="absolute italic bottom-3 right-6 text-right">
                Since: {since}
            </p>
            <button
                onClick={(e) => {
                    handler(e);
                }}
                className="absolute right-4 top-2 bg-cover w-8 h-8 invert"
                style={{ backgroundImage: `url(/pencil.png)` }}
            ></button>
        </div>
    );
}

function UserInfoEdit(props: {
    username: string;
    links: string[];
    description: string;
    since: string;
    onConfirm: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        links: string[],
        description: string
    ) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const { username, links, description, since, onCancel, onConfirm } = props;
    const [socials, setSocials] = useState([...links]);
    const [desc, setDesc] = useState(description);
    return (
        <div className="relative bg-gray-800 text-white w-auto px-8 pt-4 pb-4 mt-4 mx-4 rounded-2xl">
            <h2 className="font-bold text-3xl mb-4">{username}</h2>
            <h1 className="font-semibold text-lg mb-1">Social Medias</h1>
            <div className="list-disc italic ml-4 flex flex-col">
                {socials.map((item, index) => (
                    <input
                        key={index}
                        className="rounded bg-gray-600 w-1/4 px-2 py-0.5 my-2"
                        type="text"
                        value={item}
                        onChange={(text) => {
                            socials[index] = text.target.value;
                            setSocials([...socials]);
                        }}
                    ></input>
                ))}
            </div>
            <div className="flex flex-row flex-grow mt-2 mb-4">
                <div className=" border-solid border-gray-400 border-r-4 mr-2"></div>
                <textarea
                    className="w-full bg-gray-600 rounded px-4 py-2"
                    value={desc}
                    onChange={(e) => {
                        setDesc(e.target.value);
                    }}
                ></textarea>
            </div>
            <button
                className=" bg-gray-700 px-4 py-2 rounded-md"
                onClick={(e) => {
                    onConfirm(e, socials, desc);
                }}
            >
                Confirm
            </button>
            <p className="absolute italic bottom-3 right-6 text-right">
                Since: {since}
            </p>
            <button
                onClick={(e) => {
                    onCancel(e);
                }}
                className="absolute right-4 top-2 bg-cover w-8 h-8 invert"
                style={{ backgroundImage: `url(/back.png)` }}
            ></button>
        </div>
    );
}
