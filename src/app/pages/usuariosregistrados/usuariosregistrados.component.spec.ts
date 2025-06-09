import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosregistradosComponent } from './usuariosregistrados.component';

describe('UsuariosregistradosComponent', () => {
  let component: UsuariosregistradosComponent;
  let fixture: ComponentFixture<UsuariosregistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosregistradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosregistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
