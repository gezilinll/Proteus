import { useAppStore } from '../../store/App.store';
import { useServiceStore } from '../../store/Service.store';

const usePresenter = () => {
    const serviceStore = useServiceStore();
    const appStore = useAppStore();

    const switchAudio = () => {
        serviceStore.collab?.switchAudio();
    };

    const switchVideo = () => {
        serviceStore.collab?.switchVideo();
    };

    const leave = () => {
        serviceStore.collab?.leaveVideoChat();
        appStore.showVideoChatPanel = false;
    };
    return { switchAudio, switchVideo, leave };
};

export default usePresenter;
