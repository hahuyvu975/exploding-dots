import { _decorator, Component, Node, director, AudioClip, input, Input, EventTouch, Vec2, Collider2D, Contact2DType, IPhysics2DContact, math, Button, instantiate, RigidBody2D, Prefab, randomRange, BoxCollider2D, rect } from 'cc';
const { ccclass, property } = _decorator;

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
        type: Timer
    })
    private timer: Timer;

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

    // private contacElement: ContactElement;

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

    private nodes: Node[] = [];

    private time = 0;
    // private event: EventTouch
    protected onLoad(): void {

        
        this.timeStartGame();
    }

    protected start(): void {
    }

    private _count(): void {
        this.schedule(function () {
            this.time++;

            if (this.time === 7) {
                this.createSubNodes(2);
                this.time = 0;
            }
        }, 1);
    }

    protected timeStartGame(): void {
        this.schedule(function () {
            if (this.timer.TimeStart >= 1) {
                this.timer.reduceTime();
            };

            if (this.timer.TimeStart < 1) {
                if(localStorage.getItem('volume') === '1') {
                    this.onAudioQueue(3);
                }
                this.timer.setLabelString("");
                this.contactEvent();

                this._count();
                // Click vào node để để sản sinh bản sao
                this.tempNode.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
                input.on(Input.EventType.TOUCH_START, this.overGame, this);
                this.currentClone = 1;
            }
        }, 1, 2);
    }

    // Kéo node prefab vào node rỗng hiển thị trên màn hình game
    protected contactEvent(): void {
        this.tempNode = instantiate(this.circlePrefab);
        this.CircleNode.parent = this.canvas;

        this.CircleNode.addChild(this.tempNode);
        this.nodes.push(this.tempNode);
        const collider = this.tempNode.getComponent(Collider2D)
        if (collider) {
            // Gán sự kiện cho Collider2D của prefab
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const rigidSelf = selfCollider.getComponent(RigidBody2D);
        const rigidOther = otherCollider.getComponent(RigidBody2D);
        const selfAngle = math.randomRange(1, 2* Math.PI);
        const otherAngle = math.randomRange(1, 2 * Math.PI);
        let isCollision = false;
        // Trường hợp vật thể va chạm với các trigger tường
        switch (otherCollider.node) {
            // Đây là va chạm với tường 
            case this.triggerLeft:
                rigidSelf.applyForceToCenter(new Vec2(10 * 2, 10).multiplyScalar(70), true);
                break;
            case this.triggerRight:
                rigidSelf.applyForceToCenter(new Vec2(-10 * 2, 10).multiplyScalar(70), true);
                break;
            case this.triggerTop:
                rigidSelf.applyForceToCenter(new Vec2(10, -10 * 2).multiplyScalar(70), true);
                break;
            case this.triggerBottom:
                rigidSelf.applyForceToCenter(new Vec2(10, 10 * 2).multiplyScalar(70), true);
                break;
            default:
                // Trường hợp 2 vật thể di chuyển va chạm với nhau 
                isCollision = true;
                const selfForceMagnitude = 100; // Cường độ ban đầu của lực đẩy
                const otherForceMagnitude = 100;
                
                const selfForce = new Vec2(Math.cos(selfAngle), Math.sin(selfAngle)).normalize().multiplyScalar(selfForceMagnitude);
                const otherForce = new Vec2(Math.cos(otherAngle), Math.sin(otherAngle)).normalize().multiplyScalar(otherForceMagnitude);
                
                rigidSelf.applyForceToCenter(selfForce, true);
                rigidOther.applyForceToCenter(otherForce, true);
                
                const forceIncreaseFactor = 1.5; // Hệ số gia tăng
                
                // Ghi nhớ lực đẩy hiện tại
                let currentSelfForceMagnitude = selfForceMagnitude;
                let currentOtherForceMagnitude = otherForceMagnitude;
                
                // Khi va chạm xảy ra
                if (isCollision) {
    
                  // Tăng lực đẩy cho mỗi vật thể
                  currentSelfForceMagnitude *= forceIncreaseFactor;
                  currentOtherForceMagnitude *= forceIncreaseFactor;
                
                  // Áp dụng lực đẩy mới
                  const selfNewForce = selfForce.normalize().multiplyScalar(currentSelfForceMagnitude);
                  const otherNewForce = otherForce.normalize().multiplyScalar(currentOtherForceMagnitude);
                
                  rigidSelf.applyForceToCenter(selfNewForce, true);
                  rigidOther.applyForceToCenter(otherNewForce, true);
                }


        }
    }

    protected createSubNodes(count: number): void {
        for (let i = 0; i < count; i++) {
            if (this.currentClone > 8) {
                return;
            }
            const element = instantiate(this.circlePrefab);
            element.parent = this.CircleNode;
            element.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
            this.nodes.push(element);



            // 
            const collider = element.getComponent(Collider2D);
            if (collider) {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            this.currentClone++;
        }
    }

    // Sự kiện click vào node bất kỳ
    protected onTouchObject(event: EventTouch): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(1);
        }
        this.time = 0;
        this.scoreGame.addScore();

        const targetNode = event.target;
        if (this.tempNode === targetNode) {
            // Click vào node chính, xóa node chính và tạo ra 2 node phụ mới
            if (this.tempNode.isValid) {
                this.onClickAnimation(this.tempNode);
                this.tempNode.destroy();
                this.currentClone--;
            }
            //Tạo bản sao
            this.createSubNodes(2);
        } else {
            // Click vào node phụ, xóa node phụ và tạo ra 2 node phụ mới
            if (targetNode.isValid) {
                this.onClickAnimation(targetNode);
                targetNode.destroy();
                this.currentClone--;
            }
            //Tạo bản sao
            this.createSubNodes(2);
        }
    }

    // Tạo ra bản sao animation của prefab
    protected onClickAnimation(node: Node): void {
        if (node && node.position) {
            let elementAnim = instantiate(this.animPrefab);
            elementAnim.parent = this.CircleNode;

            elementAnim.setPosition(node.position);
        }
    }

    // Tạo ra các bản sao sau khi click node circle prefab




    protected overGame(event: EventTouch) {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(2);
        }
        if (event.getLocation().y < 535 && event.getLocation().y > 55) {
            let node = new Node('GameParamater');
            let param = node.addComponent(GameParamater);
            param.IndexScore = this.scoreGame.CurrentScore;
            director.addPersistRootNode(node);
            director.loadScene(Constants.EntryGame);
        }
    }



    protected onClickHome(): void {
        if (localStorage.getItem('volume') === '1') {
            this.onAudioQueue(0);
        }
        director.loadScene(Constants.EntryGame)
    }

    protected onAudioQueue(index: number): void {
        let clip: AudioClip = this.audioGame.Clips[index];
        this.audioGame.AudioSource.playOneShot(clip);
    }



    // Sự kiện UPDATE
    protected update(dt: number): void {

    }

}

