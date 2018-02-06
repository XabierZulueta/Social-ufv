import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    redirectUrl;

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.loggedIn()) {
            return true;
        } else {
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    }

    clear() {
        this.redirectUrl = undefined;
    }
}
