import { useRef, useEffect, Fragment } from 'react';
import { InfoProp, CampFire } from './AddCampFireForm';

export function AddCampFireSceneForm() {
    // let { setInfo, campfire} = props;


    // const campNameRef = useRef<HTMLInputElement | null>(null);
    // const campDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
    // const campInvitation = useRef<HTMLInputElement | null>(null);
    // const campPasswordRef = useRef<HTMLInputElement | null>(null);
    // const campThumbNailRef = useRef<HTMLInputElement | null>(null);

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // const name = mesNameRef.current.value;
    //     // const content = mesContentRef.current.value;
    //     // createMessage(name, content);

    //     e.target.reset();
    // }


    // useEffect(() => {
    //     console.log("effect", campNameRef.current?.value);
    //     return () => {
    //         if(campNameRef.current != null && campDescriptionRef.current != null && campInvitation.current != null && campPasswordRef.current != null && campThumbNailRef.current != null && campThumbNailRef.current.files){
    //             // if(campfire.thumbnail){
    //             //     campThumbNailRef.current.files[0] = campfire.thumbnail;
    //             // }
    //             console.log("return",campNameRef.current.value);
    //             setInfo(campNameRef.current.value, campDescriptionRef.current.value, campInvitation.current.checked, campPasswordRef.current.value, campThumbNailRef.current.files[0]);
    //         }
    //     }
    // },[]);


    return(
        <Fragment>
            <div className="m-6 p-6 max-w-lg bg-white dark:bg-gray-700 rounded-xl shadow-lg mx-auto grid justify-center">
        <label className='p-4 text-black dark:text-white shrink-0'>
            This is form two
            <input type="text" className='m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none' placeholder="Name your camp fire" required/>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Description
            <textarea className="mt-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none w-full h-36" placeholder="Describe your camp fire" required></textarea>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Invitation Only
            <input type="checkbox" className="m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none" />
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Passcode
            <input type="text" className="m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none" placeholder="Enter a passcode"/>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Thumbnail
            <input type="file"className="m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none" accept='image/*'/>
        </label>
        </div>
        </Fragment>);
}
