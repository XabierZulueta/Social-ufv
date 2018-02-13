import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { EventosService } from '../../_services/eventos.service';

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

  @Input() grupoPadre: any;
  @Output() update = new EventEmitter<any>();

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
  startMessage;
  creditosMessage;

  constructor(
    private formBuilder: FormBuilder,
    private eventosService: EventosService,
    private router: Router) {
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(150)]
      )],
      start: ['', Validators.compose([
        Validators.required]
      )],
      end: [''],
      // go: ['', Validators.compose([]
      // )],
      // maxPersonas: ['', Validators.compose([
      //   Validators.min(1)
      // ]
      // )],
      // description: ['', Validators.compose([]
      // )],
      creditos: ['0', Validators.compose([
        Validators.min(0), Validators.required]
      )]
    });
    this.enableForm();
  }

  enableForm() {
    this.form.controls['title'].enable();
    this.form.controls['start'].enable();
    this.form.controls['end'].enable();
    // this.form.controls['go'].enable();
    // this.form.controls['maxPersonas'].enable();
    // this.form.controls['description'].enable();
    this.form.controls['creditos'].enable();
  }

  disabledForm() {
    this.form.controls['title'].disable();
    this.form.controls['start'].disable();
    this.form.controls['end'].disable();
    // this.form.controls['go'].disable();
    // this.form.controls['maxPersonas'].disable();
    // this.form.controls['description'].disable();
    this.form.controls['creditos'].disable();
  }

  onAddEventoSubmit() {
    this.loading = true;
    this.disabledForm();
    const body = {
      evento: {
        title: this.form.get('title').value,
        start: this.form.get('start').value,
        creditos: this.form.get('creditos').value,
        end: this.form.get('end').value
      },
      idGrupo: this.grupoPadre._id
    };

    this.eventosService.addEvento(body).subscribe(data => {
      if (!data.success) {
        console.log(data);
      } else {
        console.log(data);
        this.update.emit();
        setTimeout(() => {
          this.loading = false;
          document.getElementById('buttonEventos').click();
          this.enableForm();
          this.createForm();
        }, 1000);
      }
    });
  }

  checkTitle() {
    const title = this.form.get('title').value;
    if (title !== '') {

    }
  }

  ngOnInit(): void {
    this.createForm();
  }

}
