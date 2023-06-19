import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Vec2, RigidBody2D, randomRange, math } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Circle')
export class Circle extends Component {
    private targetVelocity: Vec2 = new Vec2();
    private direction: Vec2 = new Vec2();
  
    protected onLoad(): void {
        this.randomizePosition();
    }

    protected start(): void {
        this.randomizeDirection();
    }

    // Random direction position for circle
    public randomizeDirection(): void {
        const angle = Math.random() * Math.PI * 2;
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);
        this.direction = new Vec2(directionX, directionY);
        this.targetVelocity = this.direction.multiplyScalar(1700);
        this.node.getComponent(RigidBody2D).applyForceToCenter(this.targetVelocity, true);   
    }

    // Random circle position in game
    protected randomizePosition(): void {
        const randomX = randomRange(-150, 150);
        const randomY = randomRange(-200, 150);
        this.node.setPosition(randomX, randomY);
    }

    protected update(): void {
           
    }
}
