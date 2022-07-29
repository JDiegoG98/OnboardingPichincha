import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Book } from '../../interfaces/book.interface';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/categories.interface';
import { BooksService } from '../../services/books.service';

import { BookInfoComponent } from './book-info.component';

const mockBook: Book = {
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
class mockBooksService {
  getBookById() { return of(mockBook) }
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
  categories: Category[] = mockCategories;
}

describe('BookInfoComponent', () => {
  let component: BookInfoComponent;
  let fixture: ComponentFixture<BookInfoComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookInfoComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
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
    fixture = TestBed.createComponent(BookInfoComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return onBack', () => {
    jest.spyOn(location, 'back');
    component.onReturn();
    expect(location.back).toHaveBeenCalled();
  });

  it('should navigate onEdit', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onEdit();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
