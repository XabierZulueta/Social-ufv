import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { AppComponent} from '../app.component';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styles: ['body { background-color: #003265 !important; }']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    error:string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
    private app : AppComponent) { 
        document.body.style.backgroundColor ='#003265';
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            res => {
                if (res.success) {
                    this.authenticationService.saveToken(res.token);
                    this.app.reload();
                    document.body.style.backgroundColor = '#fff';
                    this.router.navigateByUrl('');
                } else {
                    this.error = res.msg;
                    this.loading = false;
                }
            }
            );
    }
}