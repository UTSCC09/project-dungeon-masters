import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddCampFireInfoForm } from "./AddCampFireInfoForm";
import { AddCampFireSceneForm } from "./AddCampFireSceneForm";
import sPhotos from './AddScene/photos.json'; // static photos, change later


export interface CampFire{
    name: string;
    description: string;
    invitation: boolean;
    password: string;
    thumbnail: File | undefined;
}

export interface InfoProp {
    setCampfire: React.Dispatch<React.SetStateAction<CampFire>>;
    campfire: CampFire;
}


export function AddCampFireForm() {
    // let { campfire } = props;




    const[campfire, setCampfire] = useState<CampFire>({
        name: "",
        description: "",
        invitation: false,
        password: "",
        thumbnail: undefined
    });
    const [photos, setPhotos] = useState(sPhotos);

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

    // const handleSubmit = (e: HTMLFormElement) => {
    //     e.preventDefault();

    //     // const name = mesNameRef.current.value;
    //     // const content = mesContentRef.current.value;
    //     // createMessage(name, content);
    // }

    return(
        <div className='dark min-h-screen grid bg-gradient-to-t to-white dark:to-black via-zinc-600 from-amber-100'>
            <div className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900 max-h-14">
                { page === 0 ?
                    <div className="m-1 ml-5 pl-4 text-white">
                        <Link to="/">Cancel</Link>
                    </div>
                :
                    <div className="h-6 w-14 ml-5 pl-8 text-white btn btn_previous " onClick={prevPage}>Back</div>
                }
                <div className="text-lg text-white ">{title}</div>
                { page === 2 ?
                    <div className="m-1 mr-5 pr-4 text-white">
                        <Link to="/">Confirm</Link>
                    </div>
                :
                    <div className=" h-6 w-14 mr-5 pl-8 text-white btn btn_next" onClick={nextPage}>Next</div>
                }
            </div>
            <form className='w-full h-full place-self-center'>
                { page === 0 &&
                     <AddCampFireInfoForm setCampfire={setCampfire} campfire={campfire}/>
                }{
                    page === 1 &&
                    <AddCampFireSceneForm setPhotos={setPhotos} photos={photos}/>
                }
            </form>
        </div>
        );
}
