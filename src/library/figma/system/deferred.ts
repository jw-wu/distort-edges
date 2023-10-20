/*

How to use:

let operation = new Deferred();

{ ...
  operation.complete();
}

await operation.completion();

*/


export class Deferred {

  public complete: Function;
  public stopped: Function;


  constructor() {

    this.complete = () => { };
    this.stopped = () => { };

  }


  async completion(): Promise<void> {

    return new Promise((resolve, reject) => {

      this.complete = resolve;
      this.stopped = reject;

    });

  }

}