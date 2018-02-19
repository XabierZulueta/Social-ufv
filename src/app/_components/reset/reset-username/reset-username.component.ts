import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../../_guards/auth.guard';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['../reset.css']
})
export class ResetUsernameComponent implements OnInit {

  form;
  error;
  classError;
  loading;

  constructor(
    private authGuard: AuthGuard,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) {
    this.createForm();
    document.body.style.backgroundColor = '#003265';
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.get('email').disable();
  }

  enableForm() {
    this.form.get('email').enable();
  }

  onResetUsername() {
    this.disableForm();
    this.loading = true;
    this.authService.resetUsername(this.form.get('email').value).subscribe(data => {
      this.error = data.message;
      if (data.success) {
        this.classError = 'alert alert-success';
      } else {
        this.enableForm();
        this.classError = 'alert alert-warning';
      }
      this.loading = false;
    });
  }

  ngOnInit() {
  }

}
