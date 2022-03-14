import React, { useRef, useEffect, useState } from 'react';
import { AddCampFireInfoForm } from "./AddCampFireInfoForm";
import { AddCampFireSceneForm } from "./AddCampFireSceneForm";
// import { AddCampFireNav } from './AddCampFireNav';

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

    function setInfo(name: string , description: string, invitation: boolean, password: string, thumbnail:File | undefined) {
        setCampfire(campfire => { 
            const newCamp: CampFire = {
                name,
                description,
                invitation,
                password,
                thumbnail  
            }
            return newCamp;
        });
    }

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
        <div className='dark pb-5 min-h-screen bg-gradient-to-t to-white dark:to-zinc-900 via-stone-600 from-yellow-200'>
            <div className="top-0 w-full h-20 bg-rose-800 grid grid-cols-3 place-content-center">
                <div className="h-18 w-14 m-1 ml-5 btn btn_previous justify-self-start" onClick={prevPage}/>
                <div className="text-5xl text-amber-200 place-self-center">{title}</div>
                <div className="h-18 w-14 m-1 mr-5 btn btn_next justify-self-end" onClick={nextPage}/>
            </div>
            <form>
                { page === 0 &&
                     <AddCampFireInfoForm setCampfire={setCampfire} campfire={campfire}/>
                }{
                    page === 1 &&
                    <AddCampFireSceneForm />
                }
            </form>
        </div>
        );
}
