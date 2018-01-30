import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/index';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private authService: AuthenticationService,
    private flashMessages: FlashMessagesService,
    private router: Router) { }

  logout() {
    this.authService.logout();
    this.flashMessages.show('You are logged out', { cssClass: 'alert-info' });
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
