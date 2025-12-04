import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGarajeComponent } from './detalle-garaje.component';

describe('DetalleGarajeComponent', () => {
  let component: DetalleGarajeComponent;
  let fixture: ComponentFixture<DetalleGarajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleGarajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleGarajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
