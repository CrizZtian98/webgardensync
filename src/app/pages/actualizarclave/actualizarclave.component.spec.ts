import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarclaveComponent } from './actualizarclave.component';

describe('ActualizarclaveComponent', () => {
  let component: ActualizarclaveComponent;
  let fixture: ComponentFixture<ActualizarclaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarclaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarclaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
