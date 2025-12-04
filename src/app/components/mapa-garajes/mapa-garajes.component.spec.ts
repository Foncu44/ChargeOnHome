import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaGarajesComponent } from './mapa-garajes.component';

describe('MapaGarajesComponent', () => {
  let component: MapaGarajesComponent;
  let fixture: ComponentFixture<MapaGarajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaGarajesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapaGarajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
