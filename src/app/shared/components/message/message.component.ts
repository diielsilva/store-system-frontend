import { Component } from '@angular/core';
import { MessageProvider } from '../../providers/message.provider';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  constructor(private messageProvider: MessageProvider) { }

  public hideMessage(): void {
    this.messageProvider.hideMessage();
  }

}
