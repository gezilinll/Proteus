import { UserModel } from '../User.store';
import { UserPanelModel } from './UserPanelModel';

export class UserPanelService {
    constructor(private _model: UserPanelModel) {}

    handleSelfLogin(user: UserModel) {
        this._model.self.id = user.id;
        this._model.self.nickName = user.nickName;
        this._model.self.color = this._randomColor();
    }

    handleOtherLogin(user: UserModel) {
        this._model.others.value.push({
            id: user.id,
            nickName: user.nickName,
            color: this._randomColor(),
        });
    }

    private _randomColor() {
        let result = '';
        for (let i = 0; i < 6; ++i) {
            const value = Math.floor(16 * Math.random());
            result += value.toString(16);
        }
        return '#' + result;
    }
}
