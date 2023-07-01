export interface User {
    name: string;
    videoTrack: MediaStreamTrack | null;
    audioTrack: MediaStreamTrack | null;
    audio: boolean;
    video: boolean;
}
