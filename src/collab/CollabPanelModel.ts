import { reactive, ref } from 'vue';

export const useModel = () => {
    const id = ref('');

    const userName = ref('');

    return { id, userName };
};

export type UserModel = ReturnType<typeof useModel>;
