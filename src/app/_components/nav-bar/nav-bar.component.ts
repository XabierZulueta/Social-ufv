import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userName;
  role;

  constructor(public authService: AuthenticationService,
    private router: Router) {
    this.userName = localStorage.getItem('user') || '';
    this.role = localStorage.getItem('role') || '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

  isRepOrAdmin() {
    return this.role !== 'alumno';
  }

  isAdmin() {
    return this.role === 'alumno';
  }
}
