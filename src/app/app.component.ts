import { Component, OnInit } from '@angular/core';
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

  public static updateUserStatus: Subject<boolean> = new Subject();

  jwtHelper: JwtHelper = new JwtHelper();
  token: string;
  tokenDecoded: Object;
  userName: string;
  isLogged: boolean;
  user: string;
  userId: string;

  // Create an instance of the DataService through dependency injection
  constructor(private router: Router,
    private userService: UserService,
    private authService: AuthenticationService) {
    this.authService.authenticateState$.subscribe(state => {
      this.isLogged = state;
    });
    this.reload();
  }

  ngOnInit() {
    this.isLogged = this.authService.isAuthenticate();
    this.userService.getProfile().subscribe((profile => {
      this.user = profile.user;
      this.userName = profile.user.username;
    }));
  }

  reload() {
    this.isLogged = this.authService.isAuthenticate();
    if (this.isLogged !== false) {
      document.body.style.backgroundColor = '#f0f0f0';
      this.token = localStorage.getItem('token');
      this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
      this.userName = this.tokenDecoded['name'];
      this.userId = this.tokenDecoded['id'];
    }
  }

  logout() {
    this.userService.logout();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
