import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { User } from './usuarios/user';
import { JwtHelper } from 'angular2-jwt';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();
  token: string;
  tokenDecoded: Object;
  userName: string;
  isLogged: boolean;
  user : string;
  // Create an instance of the DataService through dependency injection
  constructor(private router: Router, private authService: AuthenticationService) {
      this.authService.authenticateState$.subscribe(
        state=>{this.isLogged = state}
      );
  }

  ngOnInit(){
    this.isLogged = this.authService.isAuthenticate();
    if(this.isLogged == false)
      this.router.navigateByUrl('/login');
    else{
      this.token = localStorage.getItem('token');
      console.log(this.token);
      this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
      console.log(this.tokenDecoded);
      this.userName = this.tokenDecoded['name'];
      console.log(this.userName);
    }
  }

  logout(){
      this.authService.logout();
      this.router.navigateByUrl('/login');
  }

}