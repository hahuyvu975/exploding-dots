import { GameParamater } from './GameParamater';
import { _decorator, Component, Node, director, AudioClip, AudioSource, Label, find } from 'cc';
const { ccclass, property } = _decorator;

import { Constants } from './Constants';
import { AudioEntry } from './AudioEntry';

@ccclass('EntryController')
export class EntryController extends Component {

    @property({
        type: AudioEntry
    })
    private audioEntry: AudioEntry;

    @property({
        type: Node,
    })
    private btnPlay: Node;

    @property({
        type: Node,
    })
    private btnSound: Node;

    @property({
        type: Node,
    })
    private btnSilent: Node;

    @property({
        type: Label,
    })
    private numberHighScore: Label;

    @property({
        type: Label,
    })
    private numberCurrentScore: Label;

    private currentScore: number;

    protected onLoad(): void {
        if (!localStorage.getItem('volume')) {
            localStorage.setItem('volume', '1');
        }
        if (localStorage.getItem('volume') === '1') {
            this.btnSound.active = true;
            this.btnSilent.active = false;
        } else {
            this.btnSound.active = false;
            this.btnSilent.active = true;
        }

        let node = find(Constants.GameParamater)
        if (node) {
            this.currentScore = node.getComponent(GameParamater).IndexScore;
            console.log(this.currentScore);
            node.destroy();

        } else {
            this.currentScore = 0;
        }
    }

    protected start(): void {
        this.showCurrentScore();
        this.showHighScore();
    }

    protected showCurrentScore(): void {
        this.numberCurrentScore.string = this.currentScore.toString();
    }

    protected showHighScore(): void {
        const tempHighScore = localStorage.getItem('maxScore');
        if (tempHighScore === null) {
            this.numberHighScore.string = `0`;
        } else {
            this.numberHighScore.string = `${tempHighScore}`;
        }
    }

    protected onPlayGame(): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        } 
        director.loadScene(Constants.GameGame);
    }

    protected onResetScore(): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        }
        localStorage.setItem('maxScore', '0');
        this.numberHighScore.string = '0';
        this.numberCurrentScore.string = '0';
    }

    protected onClickTurnOn(): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        }
        localStorage.setItem('volume', '0');
        this.btnSound.active = false;
        this.btnSilent.active = true;
    }

    protected onClickTurnOff(): void {
        localStorage.setItem('volume', '1');
        this.btnSound.active = true;
        this.btnSilent.active = false;
    }

    protected onAudioQueue(index: number): void {
        let clip: AudioClip = this.audioEntry.Clips[index];
        this.audioEntry.AudioSource.playOneShot(clip);
    }
}

