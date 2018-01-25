import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionAsistenciasComponent } from './confirmacion-asistencias.component';

describe('ConfirmacionAsistenciasComponent', () => {
  let component: ConfirmacionAsistenciasComponent;
  let fixture: ComponentFixture<ConfirmacionAsistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionAsistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
