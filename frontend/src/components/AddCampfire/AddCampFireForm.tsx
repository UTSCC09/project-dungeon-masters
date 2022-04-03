import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LobbyList from "../3d/LobbyList";
import { api } from "../../api/imageApi";
import { AddCampFireInfoForm } from "./AddCampFireInfoForm";
import { AddCampFireSceneForm } from "./AddCampFireSceneForm";
import { CampfireApi, CampfireFields } from "../../api/campfiresApi";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export interface CampFire {
    title: string;
    description: string;
    invitation: boolean;
    password: string;
    thumbnail: File | undefined;
    thumbnailUrl: string;
}

export interface CampfireSubmitData {
    title: string;
    description: string;
    status: string;
    private: boolean;
    passcode: string;
    thumbnail: string;
    soundtrack: Array<string>;
    scene: Array<string>;
}

export interface InfoProp {
    setCampfire: React.Dispatch<React.SetStateAction<CampFire>>;
    campfire: CampFire;
}

export interface Lobby {
    id: String;
    title: String;
}

export enum CFStatus {
    TALKING = "talking",
    TELLING = "telling",
    TOLD = "told",
}

export function AddCampFireForm() {
    // let { campfire } = props;
    const [campfire, setCampfire] = useState<CampFire>({
        title: "",
        description: "",
        invitation: false,
        password: "",
        thumbnail: undefined,
        thumbnailUrl: "",
    });
    const [photos, setPhotos] = useState([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [lobby, setLobby] = useState<Lobby>({
        id: "",
        title: "",
    });
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        switch (page) {
            case 0:
                setTitle("Start A Campfire");
                break;
            case 1:
                setTitle("Add Scenes for the Campfire");
                validateInfo();
                break;
            case 2:
                setErrorMessage("");
                uploadThumbnail();
                setTitle("Preparing your campfire");
                break;
        }
        // return () => {
        //     setPage(0);
        // }
    }, [page]);

    useEffect(() => {
        if(lobby.id !== "" && page === 2){
            setTitle("Your campfire is ready");
        }
    },[lobby.id]);

    const validateInfo = () => {
        let valid = true;
        let eMessage = `The following required fields are missing: `;
        if (campfire.title.trim() === "") {
            eMessage += `title`;
            valid = false;
        }
        if (campfire.description.trim() === "") {
            if (!valid) eMessage += ", ";
            eMessage += `description `;
            valid = false;
        }
        if (campfire.password.trim() === "" && campfire.invitation) {
            if (!valid) eMessage += ", ";
            eMessage += `passcode `;
            valid = false;
        }
        if (!valid) {
            setErrorMessage(eMessage);
        }else{
            setErrorMessage("");
        }
        return valid;
    };

    const nextPage = () => {
        if (page === 1) {
            let valid = validateInfo();
            if (!valid) return;
        }
        setPage(page + 1);
    };

    const prevPage = () => {
        setPage(page - 1);
    };

    const uploadThumbnail = async () => {
        if (campfire.thumbnail) {
            await api.addImage(campfire.thumbnail).then(handleSubmit);
        } else {
            handleSubmit(null);
        }
    };

    const goToLobby = () => {
        navigate("/lobby/" + lobby.id);
    }

    const handleSubmit = async (res: any) => {
        try {
            let campfireData = {
                title: campfire.title,
                description: campfire.description,
                status: CFStatus.TALKING,
                private: campfire.invitation,
                passcode: campfire.invitation ? campfire.password : "",
                thumbnail: res ? res.url : "",
                soundtrack: [],
                scenes: photos,
            };
            CampfireApi.addCampfire(
                campfireData,
                [
                    CampfireFields.title,
                    CampfireFields.id,
                    CampfireFields.followers,
                ]
            )
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    setLobby({
                        id: json.data.addCampfire._id,
                        title: json.data.addCampfire.title,
                    });
                })
                .catch((error) => {
                    setErrorMessage(error);
                });
        } catch (e) {
            console.error(e);
            setErrorMessage(String(e));
        }
    };

    return (
        <div
            className="dark min-h-screen grid bg-gradient-to-t to-white dark:to-black via-zinc-600 from-amber-100"
            style={{ height: "max-content" }}
        >
            <div className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900 max-h-14">
                {page === 0 ? (
                    <button
                        className="h-5 w-15 ml-5 pl-8 text-black btn invert"
                        style={{ backgroundImage: `url(/back.png)` }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/");
                        }}
                    ></button>
                ) : (
                    page === 1 && (
                        <div
                            className="h-5 w-15 ml-5 pl-8 text-white btn btn_previous "
                            onClick={prevPage}
                        >
                            Back
                        </div>
                    )
                )}
                <div className="text-lg text-white m-auto">{title}</div>
                {page === 0 ? (
                    <div
                        className=" h-5 w-15 mr-5 pl-8 text-white btn btn_next"
                        onClick={nextPage}
                    >
                        Next
                    </div>
                ) : page === 1 ? (
                    <div
                        className=" h-5 w-15 mr-5 pl-8 text-white btn btn_next"
                        onClick={nextPage}
                    >
                        Submit
                    </div>
                ) : (
                    lobby.id !== "" &&
                    (<div
                        className=" h-5 w-15 mr-5 pl-8 text-white btn btn_next"
                        onClick={goToLobby}
                    >
                        Enter Campfire
                    </div>)
                )}
            </div>
            {errorMessage !== "" ? (
                <div className="bg-red-200 absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded z-10">
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
            <form className="w-full h-full place-self-center">
                {page === 0 && (
                    <AddCampFireInfoForm
                        setCampfire={setCampfire}
                        campfire={campfire}
                    />
                )}
                {page === 1 && (
                    <AddCampFireSceneForm
                        setPhotos={setPhotos}
                        photos={photos}
                        setErrorMessage={setErrorMessage}
                    />
                )}
                {page === 2 && (
                    lobby.id == "" ?
                        (<div className="p-4 m-auto my-20 max-w-xl bg-white dark:bg-gray-700 rounded-xl shadow-lg text-white text-lg text-center">
                            <div>Lighting up you campfire</div>
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
                        )
                        :
                        (<div className="p-4 m-auto my-20 max-w-xl bg-white dark:bg-gray-700 rounded-xl shadow-lg text-white text-center">
                            <div className="text-lg">Your campfire {lobby.title} is ready! Invite your friend with the following link:</div>
                            <label className='p-4 w-full text-black dark:text-white shrink-0'>
                            Link
                            <input type="text" className="m-4 text-black bg-gray-200 w-4/6 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none"
                                value={process.env.REACT_APP_BACKENDURL + "/lobby/" + lobby.id}
                                readOnly
                            />
                            <CopyToClipboard text={process.env.REACT_APP_BACKENDURL + "/lobby/" + lobby.id}>
                            <button className="h-8 w-15 p-3 text-white btn btn_copy bg-grey-800 rounded-md"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    setCopied(true);}}>
                                    </button>
                            </CopyToClipboard>
                            </label>
                            {copied && (
                                <div>
                                    copied!
                                </div>
                            )}
                        </div>)   
                )}
            </form>
        </div>
    );
}
