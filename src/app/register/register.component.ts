import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService} from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { Grupo } from '../grupos/grupo';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router) { 
        document.body.style.backgroundColor = '#003265';
        this.createForm();
    }

    createForm(){
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
        }, {validator:this.comparePasswords('password', 'confirm')});
    }

    comparePasswords(pass, confirm){
        return (group:FormGroup) => {
            if(group.controls[pass].value == group.controls[confirm].value){
                return null;
            } else {
                return {'matchingPasswords': true}
            }
        }
    }

    validateUsername(controls){
        const regEx = new RegExp(/^[a-zA-Z0-9]+$/);
        if(regEx.test(controls.value)){
            return null;
        } else {
            return {'validateUsername': true}
        }
    }

    validatePassword(controls) {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        if (regExp.test(controls.value)) {
          return null; 
        } else {
          return { 'validatePassword': true } 
        }
      }

    validateEmail(controls){
        const regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if(regEx.test(controls.value)){
            return null;
        } else {
            return {'validateEmail': true}
        }
    }

    onRegisterSubmit(){
        console.log("Event fired");
        this.userService.registerUser({
            email: this.form.get('email').value,
            username: this.form.get('username').value,
            password: this.form.get('password').value 
        }).subscribe((data) => {
            console.log(data);
        });
    }

    register() {
        document.body.style.backgroundColor = '#fff';
    }
}