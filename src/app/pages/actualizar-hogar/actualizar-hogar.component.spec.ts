import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarHogarComponent } from './actualizar-hogar.component';

describe('ActualizarHogarComponent', () => {
  let component: ActualizarHogarComponent;
  let fixture: ComponentFixture<ActualizarHogarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarHogarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarHogarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
