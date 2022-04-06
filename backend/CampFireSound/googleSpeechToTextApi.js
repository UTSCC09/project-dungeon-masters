// Credit to https://stackoverflow.com/questions/50976084/how-do-i-stream-live-audio-from-the-browser-to-google-cloud-speech-via-socket-io/50976085#50976085

const {soundFXCaller} = require("./SoundFXCaller");
const speechToText = (function(){
    "use strict";
    const speech = require('@google-cloud/speech');
    let speechClient = null;
    let recognizeStream = null;

    let module = {};

    /**
     * @param {object} client A socket client on which to emit events
     */
    module.startRecognitionStream = function (client, callBack) {
        if(!speechClient) {
            speechClient = new speech.SpeechClient();
        }
        console.log("Stream started")
        recognizeStream = speechClient.streamingRecognize({
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
                profanityFilter: false,
                enableWordTimeOffsets: true
            },
            interimResults: true,
            singleUtterance: true
        })
            .on('error', (err) => {
                console.error('Error when processing audio: ' + (err && err.code ? 'Code: ' + err.code + ' ' : '') + (err && err.details ? err.details : ''));
                client.emit('googleCloudStreamError', err);
                this.stopRecognitionStream();
            })
            .on('data', (data) => {
                if (data.speechEventType === 'END_OF_SINGLE_UTTERANCE') {
                    console.log("END of utterance")
                    module.stopRecognitionStream();
                    module.startRecognitionStream(client, callBack);
                } else {
                    let results = data.results[0];
                    callBack(results.alternatives[0].transcript);
                }
            });
    },
    /**
     * Closes the recognize stream and wipes it
     */
    module.stopRecognitionStream = function () {
        console.log("Ending Stream")
        if (recognizeStream) {
            recognizeStream.end();
        }
        recognizeStream = null;
    },
    /**
     * Receives streaming data and writes it to the recognizeStream for transcription
     *
     * @param {Buffer} data A section of audio data
     */
    module.receiveData = function (data) {
        if (recognizeStream) {
            recognizeStream.write(data);
        }
    }

    return module;
})();

module.exports = {speechToText}
