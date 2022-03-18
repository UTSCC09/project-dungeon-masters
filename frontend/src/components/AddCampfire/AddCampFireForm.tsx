import React, { useEffect, useState } from 'react';
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
                console.log(campfire);
                break;
            case 1:
                setTitle("Add Scenes");
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
        <div className='dark min-h-screen grid bg-gradient-to-t to-white dark:to-zinc-900 via-stone-600 from-amber-200'>
            <div className="top-0 w-full h-20 bg-amber-700 grid grid-cols-3 place-content-center">
                { page === 0 ?
                    <div className="h-18 m-1 ml-5 btn rounded-md bg-amber-200 text-red-800 p-2 justify-self-start">Cancel</div>
                :
                    <div className="h-18 w-14 m-1 ml-5 btn btn_previous justify-self-start" onClick={prevPage}/>
                }
                <div className="text-5xl text-amber-200 place-self-center">{title}</div>
                { page === 2 ?
                    <div className="h-18 m-1 mr-5 btn rounded-md bg-amber-200 text-red-800 p-2 justify-self-end">Confirm</div>
                :
                    <div className="h-18 w-14 m-1 mr-5 btn btn_next justify-self-end" onClick={nextPage}/>
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
