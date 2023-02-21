import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request: HttpRequest<any> = req;
        let token = this.authService.getUserToken();
        if (token !== '') {
            request = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
            return next.handle(request).pipe(
                catchError((error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401 || error.status === 403) {
                            this.authService.logout();
                            this.router.navigate(['']);
                        }
                    }
                    return throwError(() => error);
                })
            );
        }
        return next.handle(request);

    }



}