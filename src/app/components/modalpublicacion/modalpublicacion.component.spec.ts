import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpublicacionComponent } from './modalpublicacion.component';

describe('ModalpublicacionComponent', () => {
  let component: ModalpublicacionComponent;
  let fixture: ComponentFixture<ModalpublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalpublicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalpublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
