import { ref } from 'vue';
import { UserModel as BaseUserModel } from '../User.store';

export interface UserModel extends BaseUserModel {
    color: string;
}

export const useModel = () => {
    const self = ref({} as UserModel);

    const others = ref([] as UserModel[]);

    return { self, others };
};

export type UserPanelModel = ReturnType<typeof useModel>;
