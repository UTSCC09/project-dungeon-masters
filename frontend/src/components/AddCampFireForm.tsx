import React, { useRef, useEffect, useState } from 'react';
import { AddCampFireInfoForm } from "./AddCampFireInfoForm";
import { AddCampFireNav } from './AddCampFireNav';

export interface CampFire{
    name: string;
    description: string;
    invitation: boolean;
    password: string;
    thumbnail: File | undefined;
}

export interface InfoProp {
    setInfo: (name: string, description: string, invitation: boolean, passcode: string, thumbnail: File | undefined) => void;
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

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // const name = mesNameRef.current.value;
    //     // const content = mesContentRef.current.value;
    //     // createMessage(name, content);

    //     e.target.reset();
    // }

    return(
        <div className='dark h-screen bg-white dark:bg-gray-600'>
        <AddCampFireNav/>
        <AddCampFireInfoForm setInfo={setInfo} campfire={campfire}/>
        </div>
        );
}
