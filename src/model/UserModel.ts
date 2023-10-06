export interface UserModel {
    id: string;
    name: string;
    color: string;
    mouseX: number;
    mouseY: number;
    peerID?: string;
    videoTrack?: MediaStreamTrack;
    audioTrack?: MediaStreamTrack;
}
