import React from "react";
import { useNavigate } from "react-router-dom";

export default function Credits() {
    const navigate = useNavigate();
    return (
        <>
        <nav className="flex bg-gray-800 flex-row justify-between py-4 border-b-2 border-gray-900">
                <button
                    className="w-6 h-6 ml-4 bg-cover invert"
                    style={{ backgroundImage: `url(/left-arrow.png)` }}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/profile");
                    }}
                ></button>
        </nav>
        <div className="text-center underline text-xl">Icons</div>
        <ul className="text-center">
            <li><a
                href="https://www.flaticon.com/free-icons/arrow"
                title="arrow icons"
            >
                Arrow icons created by bqlqn - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/edit"
                title="edit icons"
            >
                Edit icons created by Kiranshastry - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/return"
                title="return icons"
            >
                Return icons created by Kiranshastry - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/delete"
                title="delete icons"
            >
                Delete icons created by Pixel perfect - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/mute"
                title="mute icons"
            >
                Mute icons created by Kiranshastry - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/microphone"
                title="microphone icons"
            >
                Microphone icons created by Freepik - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/speaker"
                title="speaker icons"
            >
                Speaker icons created by Pixel perfect - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/mute"
                title="mute icons"
            >
                Mute icons created by Pixel perfect - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/up-arrow"
                title="up arrow icons"
            >
                Up arrow icons created by Freepik - Flaticon
            </a>
            </li>
            <li><a
                href="https://www.flaticon.com/free-icons/arrow"
                title="arrow icons"
            >
                Arrow icons created by Freepik - Flaticon
            </a>
            </li>
            <li>
            Previous and Next Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons"> Smashicons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a>
            </li>
            <li>
            <a href="https://www.flaticon.com/free-icons/delete" title="delete icons">Delete icons created by Pixel perfect - Flaticon</a>
            </li>
            <li>
            <div> add Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div>
            </li>
            <li>
            <a href="https://www.flaticon.com/free-icons/landscape" title="landscape icons">Landscape icons created by Freepik - Flaticon</a>
            </li>
            <li>
            <a href="https://www.flaticon.com/free-icons/layer" title="layer icons">Layer icons created by Freepik - Flaticon</a>
            </li>
        </ul>
        <div className="text-center underline text-xl">Code snippet from:</div>
        <ul className="text-center">
            <li>
            <a href="https://github.com/jcmcneal/react-step-wizard">React step wizard</a>
            </li>
            <li>
                <a href="https://www.agirl.codes/complete-guide-build-react-forms-with-usestate-hook">The Complete Guide to Building React Forms with useState Hook</a>
            </li>
            <li>
                <a href="https://codesandbox.io/s/py6ve?file=/src/Photo.jsx:87-94">Sortable image gallery</a>
            </li>
            <li>
                <a href="https://codesandbox.io/s/xu7kg7?file=/demo.js">Swipeable Drawers</a>
            </li>
            <li>
                <a href="https://loading.io/css/">Loading animation</a>
            </li>
            <li>
                <a href="https://stackoverflow.com/questions/50976084/how-do-i-stream-live-audio-from-the-browser-to-google-cloud-speech-via-socket-io/50976085#50976085">Speech to text over Web sockets</a>
            </li>
        </ul>
        <div className="text-center underline text-xl">Tutorials from:</div>
        <ul className="text-center">
            <li>
                <a href="https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/">upload and retrieve image on mongoDB</a>
            </li>
            <li>
                <a href="https://www.youtube.com/watch?v=R1sfHPwEH7A&ab_channel=CodingWithChaim">React Group Video Chat | simple-peer webRTC</a>
            </li>
            <li>
            <a href="https://www.youtube.com/watch?v=0fWN_q4zAqs&ab_channel=CodingWithChaim">Handle User Disconnect in WebRTC Group call</a>
            </li>
        </ul>
            <div className="text-center underline text-xl">Sounds from:</div>
            <ul className="text-center">
                <li>
                    <a href="https://freesound.org">FreeSound</a>
                </li>
            </ul>
        </>
    );
}
