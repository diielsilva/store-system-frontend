import { Component } from '@angular/core';
import { LoadingProvider } from '../../providers/loading.provider';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  constructor(public loadingProvider: LoadingProvider) { }

}
