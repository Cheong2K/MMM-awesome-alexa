import * as record from "node-record-lpcm16";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Detector, Models } from "snowboy";
import * as Timer from "timer-machine";

const WAIT_TIME = 700;

export class AlexaDetector extends Detector {
    private silenceTimer = new Timer();
    private subject: Subject<DETECTOR>;

    constructor(models: Models) {
        super({
            resource: `${process.env.CWD}/resources/common.res`,
            models: models,
            audioGain: 2.0,
        });
        this.subject = new Subject<DETECTOR>();
        this.setUp();
    }

    public start(): void {
        const mic = record.start({
            threshold: 0,
            verbose: false,
        });

        // tslint:disable-next-line:no-any
        mic.pipe(this as any);
    }

    public stop(): void {
        record.stop();
    }

    private setUp(): void {
        this.on("silence", () => {
            if (this.silenceTimer.isStarted() === false) {
                this.silenceTimer.start();
            }

            if (this.silenceTimer.timeFromStart() > WAIT_TIME) {
                this.subject.next(DETECTOR.Silence);
            }
        });

        this.on("sound", () => {
            this.silenceTimer.stop();
        });

        this.on("error", (error) => {
            console.error(error);
        });

        this.on("hotword", (index, hotword) => {
            console.log("hotword", index, hotword);
            this.subject.next(DETECTOR.Hotword);
        });
    }

    public get Observable(): Observable<DETECTOR> {
        return this.subject.asObservable();
    }
}
