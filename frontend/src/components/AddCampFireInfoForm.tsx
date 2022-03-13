import { useRef, useEffect } from 'react';
import { InfoProp, CampFire } from './AddCampFireForm';

export function AddCampFireInfoForm(props: InfoProp) {
    let { setInfo, campfire } = props;

    const campNameRef = useRef<HTMLInputElement | null>(null);
    const campDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const campInvitation = useRef<HTMLInputElement | null>(null);
    const campPasswordRef = useRef<HTMLInputElement | null>(null);
    const campThumbNailRef = useRef<HTMLInputElement | null>(null);

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // const name = mesNameRef.current.value;
    //     // const content = mesContentRef.current.value;
    //     // createMessage(name, content);

    //     e.target.reset();
    // }


    useEffect(() => {
        return () => {
            if(campNameRef.current != null && campDescriptionRef.current != null && campInvitation.current != null && campPasswordRef.current != null && campThumbNailRef.current != null && campThumbNailRef.current.files){
                // if(campfire.thumbnail){
                //     campThumbNailRef.current.files[0] = campfire.thumbnail;
                // }
                setInfo(campNameRef.current.value, campDescriptionRef.current.value, campInvitation.current.checked, campPasswordRef.current.value, campThumbNailRef.current.files[0]);
            }
        }
    },[]);

    return(
        <form className="m-6 p-6 max-w-lg bg-white dark:bg-slate-700 rounded-xl shadow-lg mx-auto grid justify-center">
        <label className='p-4 text-black dark:text-white shrink-0'>
            Name
            <input type="text" className='m-4 text-black bg-slate-200 rounded-md dark:text-white dark:bg-slate-600 p-1 focus-visible:outline-none focus-visible:border-3 focus-visible:border-amber-500 focus-visible:border-l-amber-500 transition duration-300 ease-in-out' placeholder="Name your camp fire" required defaultValue={campfire.name} ref={campNameRef}/>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Description
            <textarea className="mt-4 text-black bg-slate-200 rounded-md dark:text-white dark:bg-slate-600 p-1 focus-visible:outline-none focus-visible:border-3 focus-visible:border-amber-500 focus-visible:border-l-amber-500 transition duration-300 ease-in-out w-full h-36" placeholder="Describe your camp fire" required defaultValue={campfire.description} ref={campDescriptionRef}></textarea>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Invitation Only
            <input type="checkbox" className="m-4 text-black bg-slate-200 rounded-md dark:text-white dark:bg-slate-600 p-1 focus-visible:outline-none focus-visible:border-3 focus-visible:border-amber-500 focus-visible:border-l-amber-500 transition duration-300 ease-in-out" defaultChecked={campfire.invitation} ref={campInvitation} />
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Passcode
            <input type="text" className="m-4 text-black bg-slate-200 rounded-md dark:text-white dark:bg-slate-600 p-1 focus-visible:outline-none focus-visible:border-3 focus-visible:border-amber-500 focus-visible:border-l-amber-500 transition duration-300 ease-in-out" placeholder="Enter a passcode" defaultValue={campfire.password} ref={campPasswordRef}/>
        </label>
        <label className='p-4 text-black dark:text-white shrink-0'>
            Thumbnail
            <input type="file"className="m-4 text-black bg-slate-200 rounded-md dark:text-white dark:bg-slate-600 p-1 focus-visible:outline-none focus-visible:border-3 focus-visible:border-amber-500 focus-visible:border-l-amber-500 transition duration-300 ease-in-out" accept='.jpg,.png,.jpeg' ref={campThumbNailRef}/>
        </label>
        </form>);
}
