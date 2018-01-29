import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { AppComponent } from '../app.component';
import { fadeInAnimation } from '../_animations/index';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthGuard } from '../_guards/auth.guard';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';


@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})

export class LoginComponent implements OnInit {
    previousUrl: any;
    error;
    classError: string;
    loading = false;
    form: FormGroup;

    constructor(
        private userService: UserService,
        private authGuard: AuthGuard,
        private router: Router,
        private renderer: Renderer2,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder) {
        this.createForm();
        // document.body.style.backgroundColor = '#003265';
        this.renderer.setStyle(
            document.body,
            'background-color',
            '#003265'
        );
        this.renderer.setStyle(
            document.getElementById('contenido'),
            'background-color',
            'rgba(0, 0, 0, 0.13)'
        );
        // document.getElementById('contenido').style.backgroundColor = 'rgba(0, 0, 0, 0.13)';
        // renderer.addClass(document.body, 'background-blue');
        // renderer.addClass
        // document.body.style.backgroundColor = '#003265';
        // document.getElementById('contenido').style.backgroundColor = 'rgba(0, 0, 0, 0.13)';
    }

    createForm() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    enableForm() {
        this.form.controls['password'].enable();
        this.form.controls['username'].enable();
    }

    disabledForm() {
        this.form.controls['password'].disable();
        this.form.controls['username'].disable();
    }

    onLoginSubmit() {
        this.loading = true;
        this.disabledForm();
        const user = {
            username: this.form.get('username').value,
            password: this.form.get('password').value
        };

        this.userService.login(user).subscribe((data) => {
            this.error = data.message;
            if (!data.success) {
                this.classError = 'alert alert-danger';
                this.loading = false;
                this.enableForm();
            } else {
                this.userService.storeData(data.token, data.user);
                this.classError = 'alert alert-success';
                setTimeout(() => {
                    if (this.previousUrl) {
                        this.router.navigate([this.previousUrl]);
                    } else {
                        this.router.navigate(['/']);
                    }
                }, 2000);
            }
        });
    }

    ngOnInit() {
        if (this.authGuard.redirectUrl) {
            this.error = 'You must be logged in to see the page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.clear();
        }
    }
}
/*    model: any = {};
    loading = false;
    returnUrl: string;
    error: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
    private app: AppComponent) {
        document.body.style.backgroundColor = '#003265';
        document.getElementById('contenido').style.backgroundColor = 'rgba(0, 0, 0, 0.13)';
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
                    document.body.style.backgroundColor = '#f0f0f0';
                    document.getElementById('contenido').style.backgroundColor = '#fff';
                    document.getElementById('contenido').style.boxShadow = '0 50px 100px rgba(50, 50, 93, 0.1), \
                        0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1) !important';
                    this.router.navigateByUrl('');
                } else {
                    this.error = res.msg;
                    this.loading = false;
                }
            }
            );
    }
}*/
