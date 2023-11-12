import { useBlitzStore } from '../../store/Blitz.store';

const usePresenter = () => {
    const blitz = useBlitzStore();

    const switchAudio = () => {
        blitz.collabService.switchAudio();
    };

    const switchVideo = () => {
        blitz.collabService.switchVideo();
    };

    const leave = () => {
        blitz.collabService.leaveVideoChat();
        blitz.showVideoChatPanel = false;
    };
    return { switchAudio, switchVideo, leave };
};

export default usePresenter;
