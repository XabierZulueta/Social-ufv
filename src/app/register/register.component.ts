import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { Grupo } from '../grupos/grupo';
import { EmailValidator } from '@angular/forms/src/directives/validators';
import { AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    usernameMessageClass: string;
    emailMessageClass: string;
    model: any = {};
    loading = false;
    form: FormGroup;
    message: String;
    messageClass: String;
    emailValid;
    emailMessage;
    usernameValid;
    usernameMessage;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router) {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(30),
                this.validateEmail]
            )],
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(30),
                this.validateUsername]
            )],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                this.validatePassword]
            )],
            confirm: ['', Validators.compose([
                Validators.required]
            )]
        }, { validator: this.comparePasswords('password', 'confirm') });
    }

    enableForm() {
        this.form.controls['password'].enable();
        this.form.controls['username'].enable();
        this.form.controls['confirm'].enable();
        this.form.controls['email'].enable();
    }

    disabledForm() {
        this.form.controls['password'].disable();
        this.form.controls['username'].disable();
        this.form.controls['confirm'].disable();
        this.form.controls['email'].disable();
    }

    comparePasswords(pass, confirm) {
        return (group: FormGroup) => {
            if (group.controls[pass].value === group.controls[confirm].value) {
                return null;
            } else {
                return { 'matchingPasswords': true }
            }
        }
    }

    validateUsername(controls) {
        const regEx = new RegExp(/^[a-zA-Z0-9]+$/);
        if (regEx.test(controls.value)) {
            return null;
        } else {
            return { 'validateUsername': true };
        }
    }

    validatePassword(controls) {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validatePassword': true };
        }
    }

    validateEmail(controls) {
        const regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if (regEx.test(controls.value)) {
            return null;
        } else {
            return { 'validateEmail': true };
        }
    }

    onRegisterSubmit() {
        this.loading = true;
        this.disabledForm();
        console.log('Event fired');
        this.authService.registerUser({
            email: this.form.get('email').value,
            username: this.form.get('username').value,
            password: this.form.get('password').value
        }).subscribe((data) => {
            if (!data.success) {
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
                this.loading = false;
                this.enableForm();
            } else {
                this.messageClass = 'alert alert-success';
                this.message = data.message;
            }
            console.log(data);
        });
    }

    checkEmail() {
        const email = this.form.get('email').value;
        if (email !== '') {
            this.authService.checkEmail(email).subscribe((data) => {
                this.emailValid = data.success;
                this.emailMessage = data.message;
                if (this.emailValid) {
                    this.emailMessageClass = 'alert-success';
                } else {
                    this.emailMessageClass = 'alert-danget';
                }
            });
        }
    }

    checkUsername() {
        const username = this.form.get('username').value;
        if (username !== '') {
            this.authService.checkUsername(username).subscribe((data) => {
                this.usernameValid = data.success;
                this.usernameMessage = data.message;
                if (this.usernameValid) {
                    this.usernameMessageClass = 'alert-success';
                } else {
                    this.usernameMessageClass = 'alert-danger';
                }
            });
        }
    }

    register() {
        document.body.style.backgroundColor = '#fff';
    }
}
