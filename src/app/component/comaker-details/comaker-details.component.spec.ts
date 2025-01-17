import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComakerDetailsComponent } from './comaker-details.component';

describe('ComakerDetailsComponent', () => {
  let component: ComakerDetailsComponent;
  let fixture: ComponentFixture<ComakerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComakerDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComakerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
