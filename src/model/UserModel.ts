export interface UserModel {
    id: string;
    userName: string;
    videoTrack?: MediaStreamTrack;
    audioTrack?: MediaStreamTrack;
    audio?: boolean;
    video?: boolean;
}
