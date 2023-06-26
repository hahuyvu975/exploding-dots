
import { _decorator, Component, Node, director, AudioClip, input, Input, EventTouch, Vec2, Collider2D, Contact2DType, IPhysics2DContact, math, Button, instantiate, RigidBody2D, Prefab, randomRange, BoxCollider2D, rect, ColliderComponent, RigidBodyComponent, CircleCollider2D } from 'cc';
const { ccclass, property } = _decorator;

import { TimeOverGame } from './TimeOverGame';
import { AudioSoundTrack } from './AudioSoundTrack';
import { Timer } from './Timer';
import { AudioGame } from './AudioGame';
import { Constants } from './Constants';
import { ScoreGame } from './ScoreGame';
import { GameParamater } from './GameParamater';
import { Circle } from './Circle';

@ccclass('GameController')
export class GameController extends Component {

    @property({
        type: AudioGame
    })
    private audioGame: AudioGame;

    @property({
        type: AudioSoundTrack
    })
    private audioTrack: AudioSoundTrack;

    @property({
        type: Node,
    })
    private btnResume: Node;

    @property({
        type: Node,
    })
    private btnPause: Node;

    @property({
        type: Timer
    })
    private timer: Timer;

    @property({
        type: TimeOverGame
    })
    private timeOV: TimeOverGame;

    @property({
        type: ScoreGame
    })
    private scoreGame: ScoreGame;

    @property({ type: Node })
    private triggerTop: Node = null;

    @property({ type: Node })
    private triggerBottom: Node = null;

    @property({ type: Node })
    private triggerLeft: Node = null;

    @property({ type: Node })
    private triggerRight: Node = null;

    @property({
        type: Node
    })
    private canvas: Node;

    @property({
        type: Prefab
    })
    private circlePrefab: Prefab;

    @property({
        type: Prefab
    })
    private animPrefab: Prefab;

    @property({ type: Node })
    private CircleNode: Node;

    private tempNode: Node;

    private currentClone: number = 0;
    private time = 0;
    private isGamePaused: boolean = false;
 
    protected onLoad(): void {
        this.timeStartGame();
    }

    protected start(): void {

    }

    protected _count(): void {
        this.schedule(function () {
            this.time++;

            if (this.time === 7) {
                this.createSubNodes(2);
                this.time = 0;
            }
        }, 1);
    }
    protected scheduleTimeOV(): void {
        this.schedule(function () {
            if (this.timeOV.TimeOver > 1) {
                this.timeOV.reduceTimeOV();
            } else {
                this.overTime();
            }
        }, 1);
    }

    protected timeStartGame(): void {
        this.schedule(function () {
            if (this.timer.TimeStart >= 1) {
                this.timer.reduceTime();
            };

            if (this.timer.TimeStart < 1) {
                this.scheduleTimeOV();
                this.timer.setLabelString("");
                this.contactEvent();
                this._count();
                this.tempNode.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
                input.on(Input.EventType.TOUCH_START, this.overGame, this);
                this.currentClone = 1;
            }
        }, 1, 2);
    }

    protected contactEvent(): void {
        this.tempNode = instantiate(this.circlePrefab);
        this.CircleNode.parent = this.canvas;

        this.CircleNode.addChild(this.tempNode);
    }

    protected createSubNodes(count: number): void {
        for (let i = 0; i < count; i++) {
            if (this.currentClone > 9) {
                return;
            }
            const element = instantiate(this.circlePrefab);
            element.parent = this.CircleNode;
            element.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
            this.currentClone++;
        }
    }

    protected onTouchObject(event: EventTouch): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(1);
        }
        this.time = 0;
        this.scoreGame.addScore();

        const targetNode = event.target;
        if (this.tempNode === targetNode) {
            if (this.tempNode.isValid) {
                this.onClickAnimation(this.tempNode);
                this.tempNode.destroy();
                this.currentClone--;
            }
            this.createSubNodes(2);
        } else {
            if (targetNode.isValid) {
                this.onClickAnimation(targetNode);
                targetNode.destroy();
                this.currentClone--;
            }
            this.createSubNodes(2);
        }
    }

    protected onClickAnimation(node: Node): void {
        if (node && node.position) {
            let elementAnim = instantiate(this.animPrefab);
            elementAnim.parent = this.CircleNode;

            elementAnim.setPosition(node.position);
        }
    }

    protected overGame(event: EventTouch) {
        if (event.getLocation().y < 535 && event.getLocation().y > 55) {
            if (localStorage.getItem('volume') === '1') {
                this.onAudioQueue(2);
            }
            let node = new Node('GameParamater');
            let param = node.addComponent(GameParamater);
            param.IndexScore = this.scoreGame.CurrentScore;
            director.addPersistRootNode(node);
            director.loadScene(Constants.EntryGame);
        }
    }

    protected overTime(): void {
        let node = new Node('GameParamater');
        let param = node.addComponent(GameParamater);
        param.IndexScore = this.scoreGame.CurrentScore;
        director.addPersistRootNode(node);
        director.loadScene(Constants.EntryGame);
    }

    protected controlGame(): void {
        if(localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        }
        if(this.isGamePaused) {
            director.resume();
            this.isGamePaused = false;
            this.btnResume.active = true;
            this.btnPause.active = false;    
        }else {
            this.btnResume.active = false;
            this.btnPause.active = true;
            director.pause();
            this.isGamePaused = true;
        }
    }

    protected onAudioQueue(index: number): void {
        let clip: AudioClip = this.audioGame.Clips[index];
        this.audioGame.AudioSource.playOneShot(clip);
    }
}

