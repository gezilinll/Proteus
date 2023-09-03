import { ref } from 'vue';
import { UserModel } from '../model/UserModel';

export interface PlayerModel extends UserModel {
    color: string;
}

export const useModel = () => {
    const self = ref({} as PlayerModel);

    const others = ref([] as PlayerModel[]);

    return { self, others };
};

export type PlayerPanelModel = ReturnType<typeof useModel>;
