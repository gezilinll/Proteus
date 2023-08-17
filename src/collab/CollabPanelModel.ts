import { reactive, ref } from 'vue';

export const useModel = () => {
    const id = ref('');

    const nickName = ref('');

    return { id, nickName };
};

export type UserModel = ReturnType<typeof useModel>;
