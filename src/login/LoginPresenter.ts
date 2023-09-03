import { ref, watch } from 'vue';
import { useModel } from './LoginModel';
import { LoginService } from './LoginService';
import { UserModel, useUserStore } from '../collab/User.store';

const usePresenter = () => {
    const model = useModel();
    const store = useUserStore();
    const service = new LoginService(model);
    let showLoading = ref(false);

    const requestGithubAuth = () => {
        showLoading.value = true;
        location.href = service.requestGithubAuth();
    };

    const isLoading = () => {
        return showLoading.value;
    };

    watch(
        () => store.self.id,
        () => {
            if (store.self.id) {
                service.getUserInfo(store.self.id).then((model) => {
                    store.self.userName = (model as UserModel).userName;
                });
            }
        },
        {
            immediate: true,
        }
    );

    return { model, isLoading, requestGithubAuth };
};

export default usePresenter;
