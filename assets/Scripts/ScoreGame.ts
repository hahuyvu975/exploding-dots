import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreGame')
export class ScoreGame extends Component {
    @property({ 
        type: Label 
    })
    private score: Label;

    public get Score(): Label {
        return this.score;
    }
    public set Score(value: Label) {
        this.score = value;
    }

    private currentScore: number = 0;
    
    public get CurrentScore(): number {
        return this.currentScore;
    }
    public set CurrentScore(value: number) {
        this.currentScore = value;
    }

    public addScore(): void {
        this.currentScore++;
        this.score.string = this.currentScore.toString();
        if(!localStorage.getItem('maxScore')) {
            localStorage.setItem('maxScore', this.currentScore.toString());
        }
        if (this.currentScore >= parseInt(localStorage.getItem('maxScore'))) {
            localStorage.setItem('maxScore', (this.currentScore.toString()));
        } else {
            return;
        }
        
    }
}

