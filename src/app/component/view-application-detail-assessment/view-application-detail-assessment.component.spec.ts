import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationDetailAssessmentComponent } from './view-application-detail-assessment.component';

describe('ViewApplicationDetailAssessmentComponent', () => {
  let component: ViewApplicationDetailAssessmentComponent;
  let fixture: ComponentFixture<ViewApplicationDetailAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApplicationDetailAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewApplicationDetailAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
