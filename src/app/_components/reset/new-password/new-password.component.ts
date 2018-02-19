import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../../_guards/auth.guard';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['../reset.css']
})
export class NewPasswordComponent implements OnInit {

  showHidePassword = 'password';
  showHideConfirm = 'password';
  form;
  error;
  classError;
  loading;
  user;

  constructor(
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) {
    this.createForm();
    document.body.style.backgroundColor = '#003265';

    this.route.params.subscribe(params => {
      // In a real app: dispatch action to load the details here.
      console.log(params['token']);
      this.authService.getUserResetPassword(params['token']).subscribe(res => {
        console.log(res);
        if (!res.success) {
          // setTimeout(() => {
          //   this.router.navigate(['/login']);
          // }, 1000);
        } else {
          this.user = res.user;
        }
      });
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
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

  comparePasswords(pass, confirm) {
    return (group: FormGroup) => {
      if (group.controls[pass].value === group.controls[confirm].value) {
        return null;
      } else {
        return {
          'matchingPasswords': true
        };
      }
    };
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }

  disableForm() {
    this.form.get('password').disable();
    this.form.get('confirm').disable();
  }

  enableForm() {
    this.form.get('password').enable();
    this.form.get('confirm').enable();
  }

  onSetNewPassword() {
    this.disableForm();
    this.loading = true;
    this.authService.resetPassword(this.form.get('password').value).subscribe(data => {
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

  changeInputType() {
    if (this.showHidePassword === 'password') {
      this.showHidePassword = 'text';
    } else {
      this.showHidePassword = 'password';
    }
  }

  changeConfirmInputType() {
    if (this.showHideConfirm === 'password') {
      this.showHideConfirm = 'text';
    } else {
      this.showHideConfirm = 'password';
    }
  }

  getErrorMessages(name) {
    return this.form.get(name).hasError('required') ? 'El ' + name + 'es obligatorio' : '';
    // this.email.hasError('required') ? 'You must enter a value' :
    //   this.email.hasError('email') ? 'Not a valid email' :
  }

}
