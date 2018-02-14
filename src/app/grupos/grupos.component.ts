import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { fadeInAnimation } from '../_animations/fadein.animation';
import { PagerService } from '../_services/pager.service';
import { Tags } from '../tags/tags';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { GruposService } from '../_services/grupos.service';

@Component({
    selector: 'app-grupos',
    templateUrl: './grupos.component.html',
    styleUrls: ['../app.component.css'], animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' },
})

export class GruposComponent implements OnInit {
    grupos: Array<any>;
    tags: any;
    gruposTotal: Array<any>;
    gruposTag: Array<any>;
    grupo: any;
    nombre: String;
    isLogged: any;
    isLoading: boolean;
    pager: any = {};
    tagschecked: any;

    // paged items
    pagedItems: any[];
    // Create an instance of the DataService through dependency injection
    constructor(private _dataService: DataService,
        private authService: AuthenticationService,
        private grupoService: GruposService,
        private router: Router,
        private pagerService: PagerService) {
        this.tagschecked = [];
        this.gruposTotal = [];
        this.gruposTag = [];
    }


    ngOnInit() {
        this.tagschecked = [];
        this.gruposTotal = [];
        this.gruposTag = [];
        this.isLoading = true;
        this.isLogged = this.authService.loggedIn();
        if (this.isLogged === false) {
            this.router.navigateByUrl('/login');
        }
        this.grupoService.getAll().subscribe(data => {
            if (!data.success) {
                console.log(data);
                alert('err: ' + data.message);
            } else {
                this.isLoading = false;
                console.log(data);
                this.gruposTotal = data.grupos;
                this.gruposTotal.sort(this.sortGruposByName);
                this.grupos = this.gruposTotal;
                this.setPage(1);
            }
        });

        this.grupoService.getTags().subscribe(data => {
            if (!data.success) {
                console.log(data.message);
            } else {
                this.tags = data.tags;
            }
        });
    }

    search(nombre) {
        if (this.tagschecked.length !== 0) {
            this.grupos = this.gruposTotal.filter(this.containsTag, this);
            if (nombre) {
                this.grupos = this.grupos.filter(grupo =>
                    grupo.nombre.toLowerCase().includes(nombre.toLowerCase()));
            }
        } else if (nombre) {
            this.grupos = this.gruposTotal.filter(grupo =>
                grupo.nombre.toLowerCase().includes(nombre.toLowerCase()));
        } else {
            this.grupos = this.gruposTotal;
        }

        this.grupos.sort(this.sortGruposByName);

        this.setPage(1);
    }

    containsTag(grupo) {
        let exists = false;
        const tags = this.tagschecked;
        grupo.tags.forEach(tag => {
            if (tags.includes(tag)) {
                exists = true;
            }
        });
        return exists;
    }

    sortGruposByName(grupo1, grupo2) {
        return grupo1.nombre.toLowerCase().localeCompare(grupo2.nombre.toLowerCase());
    }

    arrayContainsArray(superset, subset) {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(function (value) {
            return (superset.indexOf(value) >= 0);
        });
    }

    setPage(page: number) {
        if (page < 1 || page > this.grupos.length) {
            this.pagedItems = this.grupos;
            this.pager = [];
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.grupos.length, page);

        // get current page of items
        // console.log(this.grupos);
        this.pagedItems = this.grupos.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    checkear(event, nombre) {
        const index = this.tagschecked.indexOf(event.source.value);
        if (index === -1) {
            this.tagschecked.push(event.source.value);
        } else {
            this.tagschecked.splice(index, 1);
        }
        this.search(nombre);
    }

    checkear2(value, nombre) {
        const index = this.tagschecked.indexOf(value);
        if (index === -1) {
            this.tagschecked.push(value);
        } else {
            this.tagschecked.splice(index, 1);
        }
        this.search(nombre);
    }

}
