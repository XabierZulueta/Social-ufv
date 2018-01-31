import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userName;

  constructor(public authService: AuthenticationService,
    private router: Router) { }

  logout() {
    this.authService.logout();
    this.userName = undefined;
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.userName = localStorage.getItem('user');
  }

}
