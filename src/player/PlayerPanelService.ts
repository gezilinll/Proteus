import { UserModel } from '../model/UserModel';
import { PlayerPanelModel } from './PlayerPanelModel';

export class PlayerPanelService {
    constructor(private _model: PlayerPanelModel) {}

    handleSelfLogin(user: UserModel) {
        this._model.self.value.id = user.id;
        this._model.self.value.userName = user.userName;
        this._model.self.value.color = this._randomColor();
    }

    handleOtherLogin(user: UserModel) {
        this._model.others.value.push({
            id: user.id,
            userName: user.userName,
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
