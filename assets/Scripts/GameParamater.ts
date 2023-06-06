import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameParamater')
export class GameParamater extends Component {
    private indexScore: number;
    public get IndexScore() {
        return this.indexScore;
    }
    public set IndexScore(value) {
        this.indexScore = value;
    }
}

