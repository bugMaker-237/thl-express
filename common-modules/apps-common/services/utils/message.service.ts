import { interval, Subscription } from 'rxjs';

export abstract class MessageService {
  constructor(protected interval: number = 400) {
    this.messageWorker();
  }
  private started = false;
  private subscription: Subscription;
  private messages: Array<{
    id: number;
    text: string;
    timeout: number;
    persit: boolean;
    data?: any;
  }> = new Array();
  private lastId = 0;

  public destroyWorker() {
    this.subscription.unsubscribe();
  }

  public push(message: {
    text: string;
    timeout?: number;
    persist?: boolean;
    data?: any;
  }) {
    this.messages.push({
      text: message.text,
      persit: message.persist || false,
      timeout: message.timeout || 0,
      data: message.data,
      id: this.lastId
    });
    this.lastId++;
  }

  public clear() {
    this.messages = [];
  }

  private messageWorker(): void {
    if (!this.started) {
      this.subscription = interval(this.interval).subscribe(intervalValue => {
        const msg = this.messages.pop();
        if (msg) {
          this.show(msg);
        }
      });
      this.started = true;
    }
  }

  protected abstract show(param: {
    text: string;
    timeout?: number;
    persist?: boolean;
    data?: any;
  }): void;
}
