import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAccessDto } from 'src/app/core/dtos/user/user-access.dto';
import { userCredentialsDto } from 'src/app/core/dtos/user/user-credentials.dto';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, private disposeProvider: DisposeProvider,
    private messageProvider: MessageProvider, private loadingProvider: LoadingProvider) {
    this.form = this.createAuthForm();
  }

  ngOnInit(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  private createAuthForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public shouldDisableAuthForm(): boolean {
    return this.form.invalid || this.loadingProvider.getLoading();
  }

  public handleAuthFormSubmit(): void {
    if (this.form.valid) {
      this.attemptAuthenticate();
    }
  }

  public attemptAuthenticate(): void {
    let userCredentials: userCredentialsDto = { username: this.form.get('username')!.value, password: this.form.get('password')!.value };
    let subscription$: Subscription = this.authService.attemptAuthenticate(userCredentials).subscribe({
      next: (userAccess: UserAccessDto) => {
        this.authService.onSuccessfulAuthentication(userAccess);
        this.router.navigate(['home']);
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Autenticação', error.error.message === undefined ? 'Não foi possível se conectar ao servidor!' : error.error.message);
      }
    });
    this.disposeProvider.insert(subscription$);
  }

}