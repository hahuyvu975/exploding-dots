import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioSoundTrack')
export class AudioSoundTrack extends Component {

    @property({
        type: AudioSource
    })
    private audioSoundTrack: AudioSource = null;

    protected onLoad(): void {
    
    }

   
}
