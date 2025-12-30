declare module 'shikwasa' {
    export class Player {
        constructor(options: {
            container: HTMLElement | (() => HTMLElement);
            audio: {
                src: string;
                title?: string;
                artist?: string;
                cover?: string;
                type?: string;
            };
            theme?: string;
            themeColor?: string;
            autoplay?: boolean;
        });
        play(): void;
        pause(): void;
        seek(time: number): void;
        update(options: {
            src?: string;
            title?: string;
            artist?: string;
            cover?: string;
        }): void;
        on(event: string, callback: () => void): void;
        destroy(): void;
    }
}
