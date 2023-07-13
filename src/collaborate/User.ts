export interface User {
    id: string;
    nickname: string;
}

export interface UserMedia {
    user: User;
    videoTrack: MediaStreamTrack | null;
    audioTrack: MediaStreamTrack | null;
    audio: boolean;
    video: boolean;
}