import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessFormComponent } from './assess-form.component';

describe('AssessFormComponent', () => {
  let component: AssessFormComponent;
  let fixture: ComponentFixture<AssessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
