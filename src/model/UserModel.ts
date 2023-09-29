export interface UserModel {
    id: string;
    name: string;
    color: string;
    mouseX: number;
    mouseY: number;
    videoTrack?: MediaStreamTrack;
    audioTrack?: MediaStreamTrack;
    audio?: boolean;
    video?: boolean;
}
