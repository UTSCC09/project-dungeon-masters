import { InfoProp, CampFire } from './AddCampFireForm';

export function AddCampFireInfoForm(props: InfoProp) {
    let { setCampfire, campfire} = props;


    // const campNameRef = useRef<HTMLInputElement | null>(null);
    // const campDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
    // const campInvitation = useRef<HTMLInputElement | null>(null);
    // const campPasswordRef = useRef<HTMLInputElement | null>(null);
    // const campThumbNailRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        setCampfire({...campfire, [e.currentTarget.name]: e.currentTarget.value});
        
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCampfire({...campfire, [e.currentTarget.name]: e.currentTarget.value}); 
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if( e.currentTarget.files !== null){
            setCampfire({...campfire, [e.currentTarget.name]: e.currentTarget.files[0]}); 
        }
    };

    const handleRemoveThumbnail = () => {
        setCampfire({...campfire, thumbnail: undefined});
    };

    return(
        <div className="p-4 m-auto max-w-xl bg-white dark:bg-gray-700 rounded-xl shadow-lg grid">
        <label className='p-4 w-full text-black dark:text-white shrink-0'>
            Name
            <input type="text" className='m-4 text-black bg-gray-200 w-5/6 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none' 
                placeholder="Name your camp fire" 
                name='name' 
                value={campfire.name} 
                onChange={handleChange} required/>
        </label>
        <label className='p-4 w-full text-black dark:text-white shrink-0'>
            Description
            <textarea className="m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none w-5/6 h-36" 
                placeholder="Describe your camp fire" 
                name='description' 
                value={campfire.description} 
                onChange={handleTextAreaChange} required></textarea>
        </label>
        <label className='p-4 w-full text-black dark:text-white shrink-0 '>
            Invitation Only
            <input type="checkbox" className="m-4 text-black bg-gray-200 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none"
                name='invitation'
                checked={campfire.invitation}
                onChange={handleChange}/>
        </label>
        <label className='p-4 w-full text-black dark:text-white shrink-0'>
            Passcode
            <input type="text" className="m-4 text-black bg-gray-200 w-5/6 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none"
                name='password'
                value={campfire.password}
                placeholder="Enter a passcode"
                onChange={handleChange}/>
        </label>
        { !campfire.thumbnail ?
                <label className='p-4 w-full text-black dark:text-white shrink-0'>
                Thumbnail
                <div>
                <input type="file"className="m-4 text-black bg-gray-200 w-5/6 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none"
                name='thumbnail'
                accept='image/*'
                onChange={handleThumbnailChange}/>
                </div>
            </label>
            :
            <div className='p-4 w-full text-black dark:text-white shrink-0'>
                Thumbnail
                <div className='grid grid-cols-5'>
                    <div className=" m-4 text-black bg-gray-200 col-span-4 rounded-md dark:text-white dark:bg-gray-600 p-1 focus-visible:outline-none">
                    {campfire.thumbnail.name}
                    </div>
                    <div className='m-4 btn btn_remove w-4/5 col-span-1 justify-self-end' onClick={handleRemoveThumbnail}/>
                </div>
            </div>
        }
        </div>
);
}
