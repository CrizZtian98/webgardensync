import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarcierreComponent } from './confirmarcierre.component';

describe('ConfirmarcierreComponent', () => {
  let component: ConfirmarcierreComponent;
  let fixture: ComponentFixture<ConfirmarcierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarcierreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarcierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
