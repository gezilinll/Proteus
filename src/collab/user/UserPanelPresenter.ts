import { useModel } from './UserPanelModel';
import { useUserStore } from '../User.store';
import { UserPanelService } from './UserPanelService';
import { watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const usePresenter = () => {
    const model = useModel();
    const service = new UserPanelService(model);

    const store = useUserStore();
    service.handleSelfLogin(store.self);
    for (const user of store.others) {
        service.handleOtherLogin(user);
    }

    watch(
        () => store.self,
        () => {
            //TODO
        },
        { deep: true }
    );

    watch(
        () => store.others,
        () => {
            console.log('watch store.others');
            const exists = new Set<string>();
            model.others.value.forEach((item) => exists.add(item.id));
            for (const user of store.others) {
                if (!exists.has(user.id)) {
                    service.handleOtherLogin(user);
                }
            }
            console.log('other', model.others.value.length);
        },
        { deep: true }
    );

    const fakeSelfLogin = () => {
        store.self.userName = 'A';
    };

    const fakeOtherLogin = () => {
        store.otherLogin(uuidv4(), 'B');
    };

    return { model, fakeSelfLogin, fakeOtherLogin };
};

export default usePresenter;
