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

  it('should request books by owner on getBooksByOwner', () => {
    const mockResponse: FilteredBooksResponse = {
      count: 2,
      items: mockBooks
    }
    service.getBooksByOwner().subscribe((res: any) => {
      expect(res.count).toBe(2);
      expect(res.items).toEqual(mockBooks);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE);
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

  it('should create book on createBook', () => {
    const newBook : Book = {
      id: '1',
      title: 'test',
      subtitle: 'test',
      author: 'test',
      url: 'test.com',
      image: 'test.com',
      resume: 'test',
      public: false,
      category: [1],
      userRegister: 'test'
    }
    service.createBook(newBook).subscribe((res: any) => {
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE);
    expect(req.request.method).toBe("POST");
  });

  it('should create book on createBook', () => {
    const bookId = 'test';
    const mockResponse = mockBooks[0];
    service.getBookById(bookId).subscribe((res: any) => {
      expect(res.id).toEqual(mockResponse.id);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE + `/${bookId}`);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });
});
