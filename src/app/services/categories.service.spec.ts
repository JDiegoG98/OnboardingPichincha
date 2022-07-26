import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Category } from '../interfaces/categories.interface';

import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CategoriesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request categories on getCategories', () => {
    const mockCategories: Category[] = [
      {
        id: 1,
        description: 'test1'
      },
      {
        id: 2,
        description: 'test2'
      },
      {
        id: 3,
        description: 'test3'
      }
    ];
    service.getCategories().subscribe(res => {
      expect(res.length).toBe(3);
      expect(res).toEqual(mockCategories);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.GET_CATEGORIES);
    expect(req.request.method).toBe("GET");
    req.flush(mockCategories);
  });
});
