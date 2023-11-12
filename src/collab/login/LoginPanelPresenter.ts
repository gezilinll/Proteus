import { ref, watch } from 'vue';
import { LoginPanelService } from './LoginPanelService';
import { UserModel } from '../../model/UserModel';
import { useUserStore } from '../../store/User.store';

const usePresenter = () => {
    const store = useUserStore();
    const service = new LoginPanelService();
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
                        store.self.name = (model as UserModel).name;
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
