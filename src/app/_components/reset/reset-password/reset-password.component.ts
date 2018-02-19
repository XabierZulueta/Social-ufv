import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../../_guards/auth.guard';
import { AuthenticationService } from '../../../_services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../reset.css']
})
export class ResetPasswordComponent implements OnInit {

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
      username: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.get('username').disable();
  }

  enableForm() {
    this.form.get('username').enable();
  }

  onResetPassword() {
    this.disableForm();
    this.loading = true;
    this.authService.resetPassword(this.form.get('username').value).subscribe(data => {
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
