// Credit to https://stackoverflow.com/questions/50976084/how-do-i-stream-live-audio-from-the-browser-to-google-cloud-speech-via-socket-io/50976085#50976085

const speechToText = (function(){
    "use strict";
    const speech = require('@google-cloud/speech');
    let speechClient = null;
    let recognizeStream = null;

    let module = {};

    /**
     * @param {object} client A socket client on which to emit events
     */
    module.startRecognitionStream = function (client) {
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
        })
            .on('error', (err) => {
                console.error('Error when processing audio: ' + (err && err.code ? 'Code: ' + err.code + ' ' : '') + (err && err.details ? err.details : ''));
                client.emit('googleCloudStreamError', err);
                this.stopRecognitionStream();
            })
            .on('data', (data) => {
                //TODO: pass data to soundFX caller
                let final = data.results.map(value => {
                    if (value.isFinal) {
                        return value;
                    }
                });
                console.log(final)
                // if end of utterance, let's restart stream
                // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
                if (data.results[0] && data.results[0].isFinal) {
                    module.stopRecognitionStream();
                    module.startRecognitionStream(client);
                    // console.log('restarted stream serverside');
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
