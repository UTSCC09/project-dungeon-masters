//Credited to https://stackoverflow.com/questions/50976084/how-do-i-stream-live-audio-from-the-browser-to-google-cloud-speech-via-socket-io/50976085#50976085
export class SoundToTextUtility {
    private bufferSize = 2048
    private AudioContext: any
    private context: any
    private processor: any
    private input: any
    private globalStream: any

    initStreaming = (socket: any) => {
        socket.emit('startGoogleCloudStream');
        this.AudioContext = window.AudioContext;
        this.context = new AudioContext();
        this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1);
        this.processor.connect(this.context.destination);
        this.context.resume();
    }

    listenToStream = (stream: MediaStream, socket: any, onError: (message: string) => any) => {
        this.globalStream = stream;
        this.input = this.context.createMediaStreamSource(stream);
        this.input.connect(this.processor);

        this.processor.onaudioprocess = (e: any) => {
            this.microphoneProcess(e, socket);
        }

        socket.on('googleCloudStreamError', (error: any) => {
            if(onError) {
                onError('error');
            }
            // We don't want to emit another end stream event
            this.closeAll(socket);
        });
    }

    stopRecording = (socket: any) => {
        socket.emit('endGoogleCloudStream');
        this.closeAll(socket);
    }

    // Helper functions
    /**
     * Processes microphone data into a data stream
     *
     * @param {object} e Input from the microphone
     * @param socket
     */
    private microphoneProcess = (e: any, socket: any) => {
        var left = e.inputBuffer.getChannelData(0);
        var left16 = this.convertFloat32ToInt16(left);
        socket.emit('binaryAudioData', left16);
    }

    /**
     * Converts a buffer from float32 to int16. Necessary for streaming.
     * sampleRateHertz of 1600.
     *
     * @param {object} buffer Buffer being converted
     */
    private convertFloat32ToInt16 = (buffer: any) => {
        let l = buffer.length;
        let buf = new Int16Array(l / 3);

        while (l--) {
            if (l % 3 === 0) {
                buf[l / 3] = buffer[l] * 0xFFFF;
            }
        }
        return buf.buffer
    }

    /**
     * Stops recording and closes everything down. Runs on error or on stop.
     */
    private closeAll = (socket: any) => {
        // Clear the listeners (prevents issue if opening and closing repeatedly)
        socket.off('speechData');
        socket.off('googleCloudStreamError');
        let tracks = this.globalStream ? this.globalStream.getTracks() : null;
        let track = tracks ? tracks[0] : null;
        if(track) {
            track.stop();
        }

        if(this.processor) {
            if(this.input) {
                try {
                    this.input.disconnect(this.processor);
                } catch(error) {
                    console.warn('Attempt to disconnect input failed.')
                }
            }
            this.processor.disconnect(this.context.destination);
        }
        if(this.context) {
            this.context.close().then(() => {
                this.input = null;
                this.processor = null;
                this.context = null;
                this.AudioContext = null;
            });
        }
    }
}
