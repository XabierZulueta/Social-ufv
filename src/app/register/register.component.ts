import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService} from '../_services/alert.service';
 import { UserService } from '../_services/user.service';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { 
        document.body.style.backgroundColor = '#003265';
        }

    register() {
        document.body.style.backgroundColor = '#fff';
    }
}