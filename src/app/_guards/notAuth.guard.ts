import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/index';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate() {
        if (!this.authService.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
