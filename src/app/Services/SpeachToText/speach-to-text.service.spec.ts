import { TestBed } from '@angular/core/testing';

import { SpeachToTextService } from './speach-to-text.service';

describe('SpeachToTextService', () => {
  let service: SpeachToTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeachToTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
