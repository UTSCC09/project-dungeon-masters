import {Howl, Howler} from 'howler';
export const sfxPlayer = (function(){
    "use strict";

    let sounds = {};

    let module = {};

    module.loadSound = function (entity, url) {
        console.log(process.env.REACT_APP_BACKENDURL + url)
        sounds[entity] = new Howl({
            src: [process.env.REACT_APP_BACKENDURL + url],
            preload: true,
            html5: true,
            volume: 0.5,
            mute: true
        });
        sounds[entity].play();
        sounds[entity].stop();
    }

    module.playSound = function (entity) {
        if (Object.keys(sounds).includes(entity)) {
            sounds[entity].mute(false);
            sounds[entity].play();
            sounds[entity].fade(0.75, 0, 100);
        } else {
            console.log("SFX does not exist")
        }
    }

    module.isSoundPlaying = function (entity, callBack) {
        if (Object.keys(sounds).includes(entity)) {
            callBack(sounds[entity].playing());
        } else {
            console.log("SFX does not exist")
        }
    }

    module.stopAll = function () {
        Object.keys(sounds).forEach(entity => {
            sounds[entity].stop();
        });
    }

    return module;
})();
