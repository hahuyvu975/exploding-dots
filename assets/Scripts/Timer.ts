import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {
    @property({
        type: Label
    })
    private labelTime: Label;

    public get LabelTime(): Label {
        return this.labelTime;
    }
    public set LabelTime(value: Label) {
        this.labelTime = value;
    }

    public setLabelString(value: string): void{
        this.LabelTime.string = value;
    }

    private timeStart: number = 3;

    public get TimeStart(): number {
        return this.timeStart;
    }
    public set TimeStart(value: number) {
        this.timeStart = value;
    }
    
    public reduceTime(): void {
        this.timeStart--;
        this.labelTime.string = `${this.timeStart}`
    }
}

