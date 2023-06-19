import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeOverGame')
export class TimeOverGame extends Component {
    @property({
        type: Label
    })
    private labelTimeOverGame: Label;
    public get LabelTimeOverGame(): Label {
        return this.labelTimeOverGame;
    }
    public set LabelTimeOverGame(value: Label) {
        this.labelTimeOverGame = value;
    }

    

    public setLabelString(value: string): void{
        this.labelTimeOverGame.string = value;
    }

    private timeOver: number = 59;
    public get TimeOver(): number {
        return this.timeOver;
    }
    public set TimeOver(value: number) {
        this.timeOver = value;
    }

    public reduceTimeOV(): void {
        this.timeOver--;
        this.labelTimeOverGame.string = `${this.timeOver}`
    }
}

