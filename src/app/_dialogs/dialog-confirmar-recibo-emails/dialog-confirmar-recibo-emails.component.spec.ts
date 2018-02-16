import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmarReciboEmailsComponent } from './dialog-confirmar-recibo-emails.component';

describe('DialogConfirmarReciboEmailsComponent', () => {
  let component: DialogConfirmarReciboEmailsComponent;
  let fixture: ComponentFixture<DialogConfirmarReciboEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmarReciboEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmarReciboEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
