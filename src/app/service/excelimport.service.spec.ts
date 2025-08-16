import { TestBed } from '@angular/core/testing';

import { ExcelimportService } from './excelimport.service';

describe('ExcelimportService', () => {
  let service: ExcelimportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelimportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
