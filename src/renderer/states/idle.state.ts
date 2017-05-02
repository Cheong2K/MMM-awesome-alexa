import { IStateMachineComponents } from "./alexa-state-machine";
import { State } from "./base.state";

export class IdleState extends State {

    constructor(components: IStateMachineComponents) {
        super(components, "idle");
    }

    public onEnter(): void {
        this.components.div.classList.remove("wrapper-active");
        document.body.classList.remove("down-size");
    }

    public onExit(): void {
        // Not needed to do as its not set anywhere
        // this.components.avs.onStartRecordingCallback = undefined;
    }

    public broadcast(type: NotificationType, data: any): void {
        this.transitionTo(this.allowedStateTransitions.get("listening"));
    }
}
