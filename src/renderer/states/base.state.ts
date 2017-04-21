import { IStateMachineComponents } from "./alexa-state-machine";

export abstract class State {
    protected allowedStateTransitions: Map<StateName, State>;
    private onStateChangeFunc: (state: State) => void;

    constructor(protected components: IStateMachineComponents, public name: StateName) {
        this.allowedStateTransitions = new Map<StateName, State>();
    }

    public abstract onEnter(): void;

    public abstract onExit(): void;

    public abstract broadcast(type: NotificationType, data: any): void;

    public onStateChange(event: (state: State) => void): void {
        this.onStateChangeFunc = event;
    }

    protected transitionTo(state: State): void {
        if (!this.canTransition(state)) {
            console.error(`Invalid transition to state: ${state}`);
            return;
        }

        console.info(`transiting to state: ${state}`);

        this.transition(state);
    }

    private canTransition(state: State): boolean {
        if (this.allowedStateTransitions.has(state.name)) {
            return true;
        } else {
            return false;
        }
    }

    private transition(state: State): void {
        this.onStateChangeFunc(state);
        state.onEnter();
    }

    public set AllowedStateTransitions(states: Map<StateName, State>) {
        this.allowedStateTransitions = states;
    }
}
