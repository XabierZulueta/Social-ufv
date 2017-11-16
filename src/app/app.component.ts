import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { User } from './usuarios/user';
import { JwtHelper } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';

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
  userId:string;
  public static updateUserStatus: Subject<boolean> = new Subject();
  // Create an instance of the DataService through dependency injection
  constructor(private router: Router, private authService: AuthenticationService) {
      this.authService.authenticateState$.subscribe(
        state=>{this.isLogged = state}
      );
      this.reload();
  }

  ngOnInit(){
    this.isLogged = this.authService.isAuthenticate();
    if(this.isLogged != false){
     
      this.token = localStorage.getItem('token');
      this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
      this.userName = this.tokenDecoded['name'];
      this.userId = this.tokenDecoded['id'];
    }
  }

  reload(){
    this.isLogged = this.authService.isAuthenticate();
    if (this.isLogged != false) {
      this.token = localStorage.getItem('token');
      this.tokenDecoded = this.jwtHelper.decodeToken(this.token);
      this.userName = this.tokenDecoded['name'];
      this.userId = this.tokenDecoded['id'];
    }
  }

  logout(){
      this.authService.logout();
      this.router.navigateByUrl('/login');
  }

}