import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/categories.interface';

import { BooksComponent } from './books.component';
import { Book } from '../../interfaces/book.interface';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';

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

class mockBooksService {
  books: Book[] = [];
  getBooksByOwner() { return of(mockBooks) }
  filterBooks() { return of(mockBooks) }
}

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let categoriesService: CategoriesService;
  let booksService: BooksService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CategoriesService, useClass: mockCategoriesService },
        { provide: BooksService, useClass: mockBooksService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    booksService = TestBed.inject(BooksService);
    router = TestBed.inject(Router);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getCategories from request and store them', async () => {
    await component.getCategories();
    expect(categoriesService.categories).toEqual(mockCategories);
  });

  it('should getBooks from request and store them', async () => {
    await component.getBooks();
    expect(booksService.books).toEqual(mockBooks);
  });

  it('should redirect onAddBook', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onAddBook();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should filter books onSearch if search term', () => {
    jest.spyOn(booksService, 'filterBooks');
    const eventSearched = {
      detail: {
        target: {
          value: 'test'
        }
      }
    }

    component.onSearch(eventSearched as CustomEvent);
    expect(component.searchTerm).toEqual(eventSearched.detail.target.value);
    expect(booksService.filterBooks).toHaveBeenCalled();

    component.filterSubscription = new Subscription();
    component.selectedCategory = 1;
    component.onSearch(eventSearched as CustomEvent);
    expect(component.searchTerm).toEqual(eventSearched.detail.target.value);
    expect(booksService.filterBooks).toHaveBeenCalled();
  });

  it('should default books onSearch if not search term', () => {
    jest.spyOn(component, 'getBooks');
    const eventSearched = {
      detail: {
        target: {
          value: ''
        }
      }
    }

    component.onSearch(eventSearched as CustomEvent);
    expect(component.getBooks).toHaveBeenCalled();
  });

  it('should filter books onHandleSelectedItem if selectedItem', () => {
    jest.spyOn(booksService, 'filterBooks');
    const eventSelected = {
      detail: {
        value: 1
      }
    }

    component.handleSelectedItem(eventSelected as CustomEvent);
    expect(component.selectedCategory).toEqual(eventSelected.detail.value);
    expect(booksService.filterBooks).toHaveBeenCalled();

    component.searchTerm = 'test';
    component.filterSubscription = new Subscription();
    component.handleSelectedItem(eventSelected as CustomEvent);
    expect(component.selectedCategory).toEqual(eventSelected.detail.value);
    expect(booksService.filterBooks).toHaveBeenCalled();
  });

  it('should default books onHandleSelectedItem if not selectedItem', () => {
    jest.spyOn(component, 'getBooks');
    const eventSelected = {
      detail: {
        value: null
      }
    }

    component.handleSelectedItem(eventSelected as CustomEvent);
    expect(component.getBooks).toHaveBeenCalled();
  });
});
