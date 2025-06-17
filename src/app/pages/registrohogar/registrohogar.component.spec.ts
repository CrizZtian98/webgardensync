import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrohogarComponent } from './registrohogar.component';

describe('RegistrohogarComponent', () => {
  let component: RegistrohogarComponent;
  let fixture: ComponentFixture<RegistrohogarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrohogarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrohogarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
