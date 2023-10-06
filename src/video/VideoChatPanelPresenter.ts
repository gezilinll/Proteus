import { useServiceStore } from '../store/Service.store';

const usePresenter = () => {
    const serviceStore = useServiceStore();

    const switchAudio = () => {
        serviceStore.collab?.switchAudio();
    };

    const switchVideo = () => {
        serviceStore.collab?.switchVideo();
    };
    return { switchAudio, switchVideo };
};

export default usePresenter;
