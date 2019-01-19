import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { MineAppApiService } from '../services/mine-app-api.service';
import { UserService } from '../services/user.service';

@Injectable()
export class CanActivateViaAuthGuardInterceptor implements CanActivate {

    constructor(
        private mineApi: MineAppApiService,
        private userService: UserService,
        private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        return new Promise<boolean>((resolve, reject) => {
            const user = this.userService.getUser();
            if (!user) {
                this.userService.logout();
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                resolve(false);
                return;
            }

            this.mineApi.isLoggedIn(user.accessToken).subscribe(json => {
                const isLoggedIn = json['data']['loggedIn'];
                if (!isLoggedIn) {
                    this.router.navigate(['/login']);
                }
                resolve(isLoggedIn);
            },
            reject);
        });
    }

}
