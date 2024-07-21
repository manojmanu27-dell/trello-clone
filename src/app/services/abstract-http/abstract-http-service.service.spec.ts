import { TestBed } from '@angular/core/testing';

import { AbstractHttpServiceService } from './abstract-http-service.service';

describe('AbstractHttpServiceService', () => {
  let service: AbstractHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
