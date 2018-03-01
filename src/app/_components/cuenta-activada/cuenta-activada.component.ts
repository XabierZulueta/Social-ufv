import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cuenta-activada',
  templateUrl: './cuenta-activada.component.html',
  styleUrls: ['./cuenta-activada.component.css']
})
export class CuentaActivadaComponent implements OnInit {

  message: string;
  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute, private router: Router,
  ) { }

  ngOnInit() {
    console.log('Se mete por el componente');
    this.route.params.subscribe(params => {
      // In a real app: dispatch action to load the details here.
      this.auth.activateAccount(params['token']).subscribe(res => {
        if (!res.success) {
          console.log('Success');
          this.message = res.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        } else {
          console.log('Fail');
          this.message = res.message;
        }
      });
    });
  }

}
