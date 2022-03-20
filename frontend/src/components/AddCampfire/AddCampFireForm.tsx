import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { AddCampFireInfoForm } from "./AddCampFireInfoForm";
import { AddCampFireSceneForm } from "./AddCampFireSceneForm";

export interface CampFire{
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

export enum CFStatus{
    TALKING = "talking",
    TELLING = "telling",
    TOLD = "told"
}

export function AddCampFireForm() {
    // let { campfire } = props;




    const[campfire, setCampfire] = useState<CampFire>({
        title: "",
        description: "",
        invitation: false,
        password: "",
        thumbnail: undefined,
        thumbnailUrl: ""
    });
    const [photos, setPhotos] = useState([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const[page, setPage] = useState<number>(0);
    const[title, setTitle] = useState<string>("");

    useEffect(() => {
        switch(page){
            case 0:
                setTitle("Start A Campfire");
                break;
            case 1:
                setTitle("Add Scenes for your story");
                break;
            case 2:
                uploadThumbnail();
                setTitle("Your Campfire is ready");
                break;
        }
        // return () => {
        //     setPage(0);
        // }
    },[page]);

    const nextPage = () => {
        setPage(page + 1);
    }

    const prevPage = () => {
        setPage(page - 1);
    }

    const submitQuery = 
    `mutation AddCampfire($campfireInput: CampfireInputObject, $followers: [String]){
        addCampfire(campfireData: $campfireInput, followers: $followers) {
          title
         _id
        }
      }`;

    const uploadThumbnail = async() => {
        if(campfire.thumbnail) {
            await api.addImage(campfire.thumbnail).then(handleSubmit);
        }else{
            handleSubmit(null);
        }
    }

    const handleSubmit = (res:any) => {
        if(res){
            setCampfire({...campfire, thumbnailUrl: "http://localhost:4000" + res.url});
        }
        try {
            let result: any;
            let campfireData = {
                title: campfire.title,
                description: campfire.description,
                status: CFStatus.TALKING,
                private: campfire.invitation,
                passcode: campfire.invitation ? campfire.password : "",
                thumbnail: campfire.thumbnailUrl,
                soundtrack: [],
                scenes: photos
                };
            fetch("http://localhost:4000/graphql/", {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
                credentials: "include",
                body: JSON.stringify({
                    query: submitQuery,
                    variables: {
                        campfireInput: campfireData,
                        followers: []
                    },
                }),
            }).catch ((error)=>{
                        setErrorMessage(error);
                    }
            );
        } catch (e) {
            console.error(e);
            setErrorMessage(String(e));
        }
    };

    return(
        <div className='dark min-h-screen grid bg-gradient-to-t to-white dark:to-black via-zinc-600 from-amber-100 h-auto'>
            <div className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900 max-h-14">
                { page === 0 ?
                    <div className="m-1 ml-5 pl-4 text-white">
                        <Link to="/">Cancel</Link>
                    </div>
                : (page === 1 &&
                    <div className="h-6 w-14 ml-5 pl-8 text-white btn btn_previous " onClick={prevPage}>Back</div>
                    )
                }
                <div className="text-lg text-white ">{title}</div>
                { page === 0 ?
                    <div className=" h-6 w-14 mr-5 pl-8 text-white btn btn_next" onClick={nextPage}>Next</div>
                : (page === 1 ?
                    <div className=" h-6 w-14 mr-5 pl-8 text-white btn btn_next" onClick={nextPage}>Submit</div>
                    :<div className="m-1 mr-5 pr-4 text-white">
                        <Link to="/">Confirm</Link>
                    </div>
                )
                }
            </div>
            <div id="error" className="text-bright text-center">
                    {errorMessage}
            </div>
            <form className='w-full h-full place-self-center'>
                { page === 0 &&
                     <AddCampFireInfoForm setCampfire={setCampfire} campfire={campfire}/>
                }{
                    page === 1 &&
                    <AddCampFireSceneForm setPhotos={setPhotos} photos={photos} setErrorMessage={setErrorMessage}/>
                }
            </form>
        </div>
        );
}
