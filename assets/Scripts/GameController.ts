
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
        console.log(this.timeOV.TimeOver)
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

        const collider = this.tempNode.getComponent(Collider2D)
        if (collider) {
            // Gán sự kiện cho Collider2D của prefab
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const rigidSelf = selfCollider.getComponent(RigidBody2D);
        const rigidOther = otherCollider.getComponent(RigidBody2D);
        const num = randomRange(10, 15)
    
        switch (otherCollider.node) {
            case this.triggerLeft:
                // rigidSelf.applyForceToCenter(new Vec2(num, 10).multiplyScalar(1000 / num), true);
                break;
            case this.triggerRight:
                // rigidSelf.applyForceToCenter(new Vec2(-num * 2, 10).multiplyScalar(1000 / num), true);
                break;
            case this.triggerTop:
                // rigidSelf.applyForceToCenter(new Vec2(10, -num * 2).multiplyScalar(1000 / num), true);
                break;
            case this.triggerBottom:
                // rigidSelf.applyForceToCenter(new Vec2(10, num * 2).multiplyScalar(1000 / num), true);
                break;
            default:
               // Xử lý trường hợp mặc định khi không xác định được loại va chạm
            // const selfVelocity = rigidSelf.linearVelocity;
            // const otherVelocity = rigidOther.linearVelocity;
            // const restitution = 0.5; // Hệ số đàn hồi

            // // Tính toán vector vận tốc mới cho selfCollider
            // const newSelfVelocity = selfVelocity.subtract(otherVelocity).multiplyScalar(restitution);

            // // Tính toán lực mới dựa trên sự thay đổi vận tốc
            // const newForce = newSelfVelocity.multiplyScalar(rigidSelf.mass / TIME_STEP);

            // // Áp dụng lực mới vào selfCollider
            // rigidSelf.applyForceToCenter(newForce, true);
            break;
            
        }
    }

    protected createSubNodes(count: number): void {
        for (let i = 0; i < count; i++) {
            if (this.currentClone > 9) {
                return;
            }
            const element = instantiate(this.circlePrefab);
            element.parent = this.CircleNode;
            element.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
            // const collider = element.getComponent(Collider2D);
            // if (collider) {
            //     collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // }
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
        console.log('test',this.isGamePaused)
        if(this.isGamePaused) {
            director.resume();
            this.isGamePaused = false;
            this.btnResume.active = true;
            this.btnPause.active = false;
            console.log('1',this.isGamePaused)
            console.log('if resume pause game')
        }else {
            this.btnResume.active = false;
            this.btnPause.active = true;
            console.log('else pause game')
            director.pause();
            console.log('2',this.isGamePaused)
            this.isGamePaused = true;
        }
    }

    protected onAudioQueue(index: number): void {
        let clip: AudioClip = this.audioGame.Clips[index];
        this.audioGame.AudioSource.playOneShot(clip);
    }
}

