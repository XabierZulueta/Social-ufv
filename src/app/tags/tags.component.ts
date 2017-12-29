import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
    selector: 'tag',
    templateUrl: './tags.component.html',
    styleUrls: ['../app.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})


export class TagsComponent{
    
}