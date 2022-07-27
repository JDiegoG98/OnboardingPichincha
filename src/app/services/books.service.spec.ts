import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Book, FilteredBooksResponse } from '../interfaces/book.interface';
import { Filter } from '../interfaces/filter.interface';

import { BooksService } from './books.service';

const mockBooks: Book[] = [
  {
    id: "2ac4ly00oen",
    public: true,
    author: "Unknow",
    resume: "",
    title: "Learning Angular, 2nd Edition",
    subtitle: "A Hands-On Guide to Angular 2 and Angular 4",
    image: "https://itbook.store/img/books/9780134576978.png",
    url: "https://itbook.store/books/9780134576978",
    category: [
      57
    ],
    userRegister: "w7qfsa5f21"
  },
  {
    id: "2ac4ly00oen",
    public: true,
    author: "Unknow",
    resume: "",
    title: "Learning Angular, 2nd Edition",
    subtitle: "A Hands-On Guide to Angular 2 and Angular 4",
    image: "https://itbook.store/img/books/9780134576978.png",
    url: "https://itbook.store/books/9780134576978",
    category: [
      57
    ],
    userRegister: "w7qfsa5f21"
  }
]

describe('BooksService', () => {
  let service: BooksService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BooksService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return auth headers on getHeaders', () => {
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue('test');
    const headers = service.getHeaders();
    expect(headers).toEqual(new HttpHeaders().set('Authorization', 'Bearer test'));
  });

  it('should request books by owner on getBooksByOwner', () => {
    const mockResponse: FilteredBooksResponse = {
      count: 2,
      items: mockBooks
    }
    service.getBooksByOwner().subscribe((res: any) => {
      expect(res.count).toBe(2);
      expect(res.items).toEqual(mockBooks);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it('should filter books on filterBooks', () => {
    const filter : Filter = {
      title: 'test',
      category: [1]
    }
    const mockResponse: FilteredBooksResponse = {
      count: 2,
      items: mockBooks
    }
    service.filterBooks(filter).subscribe((res: any) => {
      expect(res.count).toBe(2);
      expect(res.items).toEqual(mockBooks);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.FILTER_BOOKS);
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });
});
