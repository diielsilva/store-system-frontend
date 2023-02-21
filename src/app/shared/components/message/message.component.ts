import { Component } from '@angular/core';
import { MessageProvider } from '../../providers/message.provider';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  constructor(public messageProvider: MessageProvider) { }

}
