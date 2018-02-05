import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { GruposService } from '../../_services/grupos.service';

@Component({
  moduleId: module.id,
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})
export class NuevoEventoComponent implements OnInit {
  titleMessageClass: string;
  titleMessage: string;
  titleValid: boolean;

  @Input() padre;

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
    private gruposService: GruposService,
    private router: Router) {
    this.createForm();
    alert(this.padre);
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        this.validateTitle]
      )],
      // start: ['', Validators.compose([
      //   Validators.required]
      // )],
      // end: ['', Validators.compose([]
      // )],
      // go: ['', Validators.compose([]
      // )],
      // maxPersonas: ['', Validators.compose([
      //   Validators.min(1)
      // ]
      // )],
      // description: ['', Validators.compose([]
      // )],
      // creditos: ['', Validators.compose([
      //   Validators.min(0)]
      // )]
    });
  }

  enableForm() {
    this.form.controls['title'].enable();
    // this.form.controls['start'].enable();
    // this.form.controls['end'].enable();
    // this.form.controls['go'].enable();
    // this.form.controls['maxPersonas'].enable();
    // this.form.controls['description'].enable();
    // this.form.controls['creditos'].enable();
  }

  disabledForm() {
    this.form.controls['title'].disable();
    // this.form.controls['start'].disable();
    // this.form.controls['end'].disable();
    // this.form.controls['go'].disable();
    // this.form.controls['maxPersonas'].disable();
    // this.form.controls['description'].disable();
    // this.form.controls['creditos'].disable();
  }

  validateTitle(controls) {
    // if (this.padre) {
    //   if (this.padre.eventos.findIndex(obj => obj.title === controls.value) !== -1) {
    //     return null;
    //   } else {
    //     return { 'validateTitle': true };
    //   }
    // } else {
    //   return null;
    // }
    return null;
  }

  onAddEventoSubmit() {
    this.loading = true;
    this.disabledForm();
    const title = {
      title: {
        title: this.form.get('title').value,
        start: this.form.get('start').value
      }
    };

    this.gruposService.addEvento(this.padre._id, title).subscribe(data => {
      if (!data.success) {

      } else {

      }
    });

    // this.authService.registerUser(user).subscribe((data) => {
    //   if (!data.success) {
    //     this.messageClass = 'alert alert-danger';
    //     this.message = data.message;
    //     this.loading = false;
    //     this.enableForm();
    //   } else {
    //     this.messageClass = 'alert alert-success';
    //     this.message = data.message;
    //   }
    //   console.log(data);
    // });
  }

  checkTitle() {
    const title = this.form.get('title').value;
    if (title !== '') {
      const index = this.padre.findIndex(obj => obj.title !== title);
      if (index === -1) {
        this.titleValid = true;
        this.titleMessage = 'Titulo disponible';
        this.titleMessageClass = 'alert-success';
      } else {
        this.titleValid = true;
        this.titleMessage = 'Ya existe un evento en este grupo con ese nombre';
        this.titleMessageClass = 'alert-success';
      }
    }
  }

  ngOnInit(): void {
  }

}
