import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendActivationLinkComponent } from './send-activation-link.component';

describe('SendActivationLinkComponent', () => {
  let component: SendActivationLinkComponent;
  let fixture: ComponentFixture<SendActivationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendActivationLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendActivationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
