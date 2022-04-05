import {Howl, Howler} from 'howler';
export const sfxPlayer = (function(){
    "use strict";


    let module = {};

    module.playSound = function (partialUrl) {
        let url = process.env.REACT_APP_BACKENDURL + partialUrl;
        let sound = new Howl({
            src: [url],
            html5: true
        });

        sound.play();
    }

    return module;
})();
