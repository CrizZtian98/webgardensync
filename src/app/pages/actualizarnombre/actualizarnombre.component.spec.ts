import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarnombreComponent } from './actualizarnombre.component';

describe('ActualizarnombreComponent', () => {
  let component: ActualizarnombreComponent;
  let fixture: ComponentFixture<ActualizarnombreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarnombreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarnombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
