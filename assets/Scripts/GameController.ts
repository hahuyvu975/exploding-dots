import { Timer } from './Timer';
import { AudioGame } from './AudioGame';
import { Constants } from './Constants';
import { _decorator, Component, Node, director, AudioClip, input, Input, EventTouch, Label } from 'cc';
import { ScoreGame } from './ScoreGame';
import { GameParamater } from './GameParamater';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property({
        type: AudioGame
    })
    private audioGame: AudioGame;

    @property({
        type: ScoreGame
    })
    private scoreGame: ScoreGame;

    @property({
        type: Timer
    })
    private timer: Timer;

    @property({
        type: Node
    })
    private btnCircle: Node;

    

    protected onLoad(): void {
        this.initListeners();
        this.scheduleTime();
    }

    protected initListeners(): void {
        input.on(Input.EventType.TOUCH_END, this.overGame, this)

    }

    protected onTouchObject(): void {
        this.scoreGame.addScore();
    }

    protected overGame(event: EventTouch) {
        if (event.getLocation().y < 515) {
            let node = new Node('GameParamater');
            let param = node.addComponent(GameParamater)
            param.IndexScore = this.scoreGame.CurrentScore;
            console.log(param.IndexScore);
            director.addPersistRootNode(node);
            director.loadScene(Constants.EntryGame)
        }
    }

    protected scheduleTime(): void {
        this.schedule(function () {
            if (this.timer.timeStart > 1) {
                this.timer.reduceTime();
            } else {
               this.btnCircle.active = true;
               this.timer.LabelTime.active = false;
            }
        }, 1);
    }

    protected onClickHome(): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        }
    }

    protected onAudioQueue(index: number): void {
        let clip: AudioClip = this.audioGame.Clips[index];
        this.audioGame.AudioSource.playOneShot(clip);
    }

    protected update(): void {
        
    }
}

