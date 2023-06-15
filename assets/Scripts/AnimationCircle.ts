import { _decorator, Component, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationCircle')
export class AnimationCircle extends Component {

    private aim: Animation;
    protected onLoad(): void {
        this.aim = this.node.getComponent(Animation)
    }

    protected start(): void{
        this.aim.play();
        setTimeout(() => {
           this.node.destroy();  
        },720 );
    }
}

