import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isUserAdmin() && this.authService.isUserOnline()) {
      return true;
    }
    else if (!this.authService.isUserAdmin() && this.authService.isUserOnline()) {
      this.router.navigate(['home']);
    }
    else {
      this.router.navigate(['']);
    }
    return false;
  }

}
