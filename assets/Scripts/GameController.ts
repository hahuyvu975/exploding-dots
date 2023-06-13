import { _decorator, Component, Node, director, AudioClip, input, Input, EventTouch, Vec2, Collider2D, Contact2DType, IPhysics2DContact, math, Button, instantiate, RigidBody2D, Prefab } from 'cc';
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

    @property({
        type: Prefab
    })
    private circlePrefab: Prefab;

    @property({ type: Node })
    private CircleNode: Node;

    private tempNode: Node;

    private currentClone: number = 0;

    protected onLoad(): void {
        this.contactEvent();
        this.tempNode.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
        this.currentClone = 1;
    }

    protected start(): void {

    }

    protected contactEvent(): void {
        this.tempNode = instantiate(this.circlePrefab);
        this.CircleNode.parent = this.canvas;


        // let circleNode = instantiate(this.circlePrefab);
        this.CircleNode.addChild(this.tempNode);

        const collider = this.tempNode.getComponent(Collider2D)
        if (collider) {
            // Gán sự kiện cho Collider2D của prefab
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const rigid = selfCollider.getComponent(RigidBody2D);
        const num = math.randomRange(1, 10);

        switch (otherCollider.node) {
            case this.triggerLeft:
                rigid.applyForceToCenter(new Vec2(num * 2, math.randomRange(7, 12)).multiplyScalar(300 / num), true);
                break;
            case this.triggerRight:
                rigid.applyForceToCenter(new Vec2(-num * 2, math.randomRange(7, 12)).multiplyScalar(300 / num), true);
                break;
            case this.triggerTop:
                rigid.applyForceToCenter(new Vec2(math.randomRange(7, 12), -num * 2).multiplyScalar(300 / num), true);
                break;
            case this.triggerBottom:
                rigid.applyForceToCenter(new Vec2(math.randomRange(7, 12), num * 2).multiplyScalar(300 / num), true);
                break;
            default:

        }
    }



    // Sự kiện click vào node bất kỳ
    protected onTouchObject(): void {
        console.log('123')
        // Tính điểm sau mỗi click chuột vào Circle
        this.scoreGame.addScore();
        for (let i = 0; i < 2; i++) {
            if (this.currentClone > 7) {
                return;
            }
            let element = instantiate(this.circlePrefab);
            element.parent = this.CircleNode;
            // các clone khác có thể tạo ra bản sao
            element.on(Node.EventType.TOUCH_START, this.onTouchObject, this);
            // các clone có thể va chạm mặt tường
            let collider = element.getComponent(Collider2D);
            if (collider) {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            // Xoá clone vừa bị click
                // element.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
                //     const targetNode = event.target;
                //     if (targetNode === element) {
                        
                //         element.destroy();
                //     }
                //         element = instantiate(this.circlePrefab);
                //         element.parent = this.CircleNode;
                   
                // });
    

            this.currentClone++;
        }

    }

    protected onClick(): void {

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
}

