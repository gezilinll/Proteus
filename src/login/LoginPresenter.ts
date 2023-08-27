import { useModel } from './LoginModel';
import { LoginService } from './LoginService';

const usePresenter = () => {
    const model = useModel();
    const service = new LoginService(model);

    const requestGithubAuth = () => {
        console.log('111');
        location.href = service.requestGithubAuth();
    };

    return { model, requestGithubAuth };
};

export default usePresenter;
