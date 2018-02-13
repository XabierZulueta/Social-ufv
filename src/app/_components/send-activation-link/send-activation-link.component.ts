import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-send-activation-link',
  templateUrl: './send-activation-link.component.html',
  styleUrls: ['./send-activation-link.component.css']
})
export class SendActivationLinkComponent implements OnInit {

  form;
  error;
  classError;
  constructor(
    private auth: AuthenticationService, private renderer: Renderer2,
    private formBuilder: FormBuilder) {
    document.body.style.backgroundColor = '#003265';
    this.createForm();
  }

  ngOnInit() {
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

  sendActivationLink() {
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.auth.resend(user).subscribe(res => {
      this.error = res.message;
      this.classError = res.success ? 'alert alert-success' : 'alert alert-danger';
    });
  }

}
