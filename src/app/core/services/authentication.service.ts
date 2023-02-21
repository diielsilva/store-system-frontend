import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { UserAccessDto } from '../dtos/user/user-access.dto';
import { userCredentialsDto } from '../dtos/user/user-credentials.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userAccess?: UserAccessDto;
  private api: string = `${environment.api}/login`;

  constructor(private restClient: HttpClient) { }

  public attemptAuthenticate(userCredentials: userCredentialsDto): Observable<UserAccessDto> {
    return this.restClient.post<UserAccessDto>(this.api, userCredentials);
  }

  public onSuccessfulAuthentication(userAccess: UserAccessDto): void {
    this.userAccess = userAccess;
  }

  public isUserOnline(): boolean {
    return this.userAccess !== undefined;
  }

  public isUserAdmin(): boolean {
    return this.userAccess !== undefined && this.userAccess.permission.toString() === 'ROLE_ADMIN';
  }

  public getUserToken(): string {
    if (this.userAccess === undefined) {
      return '';
    }
    return this.userAccess.accessToken;
  }

  public logout(): void {
    this.userAccess = undefined;
  }

}
