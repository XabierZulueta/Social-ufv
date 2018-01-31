import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { User } from './usuarios/user';
import { JwtHelper } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';
// import fade in animation
import { fadeInAnimation } from './_animations/index';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], animations: [fadeInAnimation],

  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' }
})

export class AppComponent implements OnInit {

  userName: string;

  // Create an instance of the DataService through dependency injection
  constructor(private router: Router,
    private userService: UserService,
    private authService: AuthenticationService) {
    // this.authService.authenticateState$.subscribe(state => {
    //   this.isLogged = state;
    // });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe((profile => {
      if (!profile.success) {
        this.authService.logout();
        this.router.navigate(['/login']);
        console.log('no funciona');
      } else {
        console.log('funciona');
        this.userName = profile.user.username;
      }
    }));
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
