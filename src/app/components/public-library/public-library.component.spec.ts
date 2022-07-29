import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription } from 'rxjs';
import { BooksService } from '../../services/books.service';
import { Book, FilteredBooksResponse } from '../../interfaces/book.interface';

import { PublicLibraryComponent } from './public-library.component';
import { Category } from '../../interfaces/categories.interface';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';

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

const filterResponse: FilteredBooksResponse = {
  count: 2,
  items: mockBooks
}

class mockBooksService {
  userBooks: Book[] = [];
  publicBooks: Book[] = [];
  getBooksByOwner() { return of(mockBooks) }
  filterBooks() { return of(filterResponse) }
}

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
]
class mockCategoriesService {
  categories: Category[] = [];
  getCategories() { return of(mockCategories) }
}

describe('PublicLibraryComponent', () => {
  let component: PublicLibraryComponent;
  let fixture: ComponentFixture<PublicLibraryComponent>;
  let booksService: BooksService;
  let categoriesService: CategoriesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicLibraryComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: BooksService, useClass: mockBooksService },
        { provide: CategoriesService, useClass: mockCategoriesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLibraryComponent);
    component = fixture.componentInstance;
    booksService = TestBed.inject(BooksService);
    categoriesService = TestBed.inject(CategoriesService);
    router = TestBed.inject(Router);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getBooks from request and store them', async () => {
    await component.getBooks();
    expect(booksService.userBooks).toEqual(mockBooks);
    expect(booksService.publicBooks).toEqual(mockBooks);
  });

  it('should getCategories from request and store them', async () => {
    await component.getCategories();
    expect(categoriesService.categories).toEqual(mockCategories);
  });

  it('should call filterBooks onSearch', () => {
    jest.spyOn(component, 'filterPublicBooks');
    const event = {
      detail: {
        target: {
          value: 'test'
        }
      }
    }
    component.onSearch(event as CustomEvent);
    expect(component.filterPublicBooks).toHaveBeenCalled();
  });

  it('should call filterBooks onClickCheckbox', () => {
    jest.spyOn(component, 'filterPublicBooks');
    const eventTrue = {
      detail: {
        checked: true
      }
    }
    component.onClickCheckbox(eventTrue as CustomEvent);
    expect(component.filterPublicBooks).toHaveBeenCalled();

    const eventFalse = {
      detail: {
        checked: false
      }
    }
    component.onClickCheckbox(eventFalse as CustomEvent);
    expect(component.filterPublicBooks).toHaveBeenCalled();
  });

  it('should reset search if no filter', () => {
    jest.spyOn(component, 'getBooks');
    component.filterPublicBooks();
    expect(component.getBooks).toHaveBeenCalled();

    jest.spyOn(booksService, 'filterBooks');
    component.searchTerm = 'test';
    component.filterSubscription = new Subscription();
    component.filterPublicBooks();
    expect(booksService.filterBooks).toHaveBeenCalled();
  });

  it('should redirect onSelectBook', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onSelectBook('test');
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should redirect onViewMore', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onViewMore();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
