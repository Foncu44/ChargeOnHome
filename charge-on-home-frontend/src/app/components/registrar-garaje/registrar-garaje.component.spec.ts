import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarGarajeComponent } from './registrar-garaje.component';

describe('RegistrarGarajeComponent', () => {
  let component: RegistrarGarajeComponent;
  let fixture: ComponentFixture<RegistrarGarajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarGarajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarGarajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
