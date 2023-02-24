import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidebar: boolean = false;

  constructor(private authService: AuthenticationService) { }

  public displayOrHideSidebar(): void {
    this.sidebar = !this.sidebar;
  }

  public isUserOnline(): boolean {
    return this.authService.isUserOnline();
  }

  public isUserAdmin(): boolean {
    return this.authService.isUserAdmin();
  }
}
