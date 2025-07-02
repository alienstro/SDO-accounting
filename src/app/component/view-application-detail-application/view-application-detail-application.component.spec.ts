import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationDetailApplicationComponent } from './view-application-detail-application.component';

describe('ViewApplicationDetailApplicationComponent', () => {
  let component: ViewApplicationDetailApplicationComponent;
  let fixture: ComponentFixture<ViewApplicationDetailApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApplicationDetailApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewApplicationDetailApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
