import { _decorator, Component, Node, Collider2D, Contact2DType, Vec3, randomRange, IPhysics2DContact, CCInteger, RigidBody2D, Vec2, instantiate, math } from 'cc';
import { ScoreGame } from './ScoreGame';

const { ccclass, property } = _decorator;

@ccclass('Circle')
export class Circle extends Component {

    private rigidBody: RigidBody2D | null = null;

    
  
   
    protected onLoad(): void {
        this.randomizePosition();
        
        // this.arrNode.push(this.node)
        

    }

    protected start(): void {
        this.randomizeDirection();
        
        
    }

    protected callback(): void {
        console.log('event')
    }

    // Random direction  position for circle
    public randomizeDirection(): void {
        const angle = Math.random() * Math.PI * 2;
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);

        const v3 = new Vec2(directionX, directionY);

        const f = v3.multiplyScalar(1000);

        this.node.getComponent(RigidBody2D).applyForceToCenter(f, true);
    }

    // Random circle position in game
    protected randomizePosition(): void {
        const randomX = randomRange(-150, 150);
        const randomY = randomRange(-200, 150);
        this.node.setPosition(randomX, randomY);
    }
}
