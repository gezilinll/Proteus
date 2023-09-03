import { ref } from 'vue';
import { useModel } from './LoginModel';
import { LoginService } from './LoginService';

const usePresenter = () => {
    const model = useModel();
    const service = new LoginService(model);
    let showLoading = ref(false);

    const requestGithubAuth = () => {
        showLoading.value = true;
        location.href = service.requestGithubAuth();
    };

    const isTourist = () => {
        return service.isTourist();
    };

    const isValidUser = () => {
        return service.isValidUser();
    };

    const isLoading = () => {
        return showLoading.value;
    };

    return { model, isLoading, requestGithubAuth, isTourist, isValidUser };
};

export default usePresenter;
