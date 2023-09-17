import { ref, watch } from 'vue';
import { LoginService } from './LoginService';
import { UserModel } from '../model/UserModel';
import { useUserStore } from '../store/User.store';

const usePresenter = () => {
    const store = useUserStore();
    const service = new LoginService();
    let showLoading = ref(false);

    const requestGithubAuth = () => {
        showLoading.value = true;
        location.href = service.requestGithubAuth();
    };

    const isLoading = () => {
        return showLoading.value;
    };

    watch(
        () => store.token,
        () => {
            if (store.token) {
                service
                    .getUserInfo(store.self.id)
                    .then((model) => {
                        store.self.userName = (model as UserModel).userName;
                    })
                    .catch((error) => {
                        console.log('getUserInfo failed.', error);
                        store.self.id = '';
                        store.token = '';
                    });
            }
        },
        {
            immediate: true,
        }
    );

    return { isLoading, requestGithubAuth };
};

export default usePresenter;
