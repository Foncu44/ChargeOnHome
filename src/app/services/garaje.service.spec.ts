import { TestBed } from '@angular/core/testing';

import { GarajeService } from './garaje.service';

describe('GarajeService', () => {
  let service: GarajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GarajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
