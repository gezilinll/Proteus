export interface User {
    name: string;
    track: MediaStreamTrack | null;
    audio: boolean;
    video: boolean;
}
