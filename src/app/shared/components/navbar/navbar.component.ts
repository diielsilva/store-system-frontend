import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidebar: boolean = false;

  constructor(public authService: AuthenticationService) { }

  public displayOrHideSidebar(): void {
    this.sidebar = !this.sidebar;
  }
}
