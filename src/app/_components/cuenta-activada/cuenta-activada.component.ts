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
    this.route.params.subscribe(params => {
      // In a real app: dispatch action to load the details here.
      this.auth.activateAccount(params['token']).subscribe(res => {
        if (!res.success) {
          this.message = res.message;
        } else {
          this.message = res.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        }
      });
    });
  }

}
