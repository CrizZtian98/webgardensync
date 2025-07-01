import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmareliminacionComponent } from './confirmareliminacion.component';

describe('ConfirmareliminacionComponent', () => {
  let component: ConfirmareliminacionComponent;
  let fixture: ComponentFixture<ConfirmareliminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmareliminacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmareliminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
