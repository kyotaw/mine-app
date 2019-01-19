import { Injectable } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../services/user.service';

@Injectable()
export class JwtIterceptor implements HttpInterceptor {

    constructor(private userService: UserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.userService.getUser();
        if (user && user.accessToken) {
            const token = `Bearer ${user.accessToken}`;
            const newReq = request.clone({setHeaders: {Authorization: token}});
            return next.handle(newReq);
        } else {
            return next.handle(request);
        }
    }

}
