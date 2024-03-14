declare class MySetInterVal {
    a: number;
    b: number;
    time: number;
    handle: any;
    fn: Function;
    constructor(fn: Function, a: number, b: number);
    start(): void;
    stop(): void;
}
declare let a: MySetInterVal;
