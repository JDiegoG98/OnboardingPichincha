import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Category } from '../../interfaces/categories.interface';
import { InputValueAcessorDirective } from '../../directives/input-value-accessor.directive';

import { AddBookComponent } from './add-book.component';
import { of } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../interfaces/book.interface';

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
  createBook() { return of(true) }
  getBookById() { return of(mockBook) }
}

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;
  let categoriesService: CategoriesService;
  let booksService: BooksService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBookComponent, InputValueAcessorDirective],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(AddBookComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    booksService = TestBed.inject(BooksService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getCategories from request and store them', async () => {
    await component.getCategoriesAndBook();
    expect(categoriesService.categories).toEqual(mockCategories);
    expect(component.categoriesList).toEqual(categoriesService.categories);
  });

  it('should get bookToEdit if bookId', async() => {
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('test');
    jest.spyOn(booksService, 'getBookById');
    await component.getCategoriesAndBook();
    expect(booksService.getBookById).toHaveBeenCalled();
  });

  it('should return invalid format message if url invalid', () => {
    component.newBookForm.controls['url'].setValue('test');
    const message = component.checkErrorMessage(component.newBookForm.controls['url']);
    expect(message).toEqual('URL tiene formato inválido');
  });

  it('should patchValue onClickCheckbox', () => {
    jest.spyOn(component.newBookForm, 'patchValue');
    component.onClickCheckbox(1);
    expect(component.newBookForm.patchValue).toHaveBeenCalled();
  });

  it('should setValue onClickCheckboxPublic', () => {
    jest.spyOn(component.newBookForm.controls['public'], 'setValue');
    component.onClickCheckboxPublic();
    expect(component.newBookForm.controls['public'].setValue).toHaveBeenCalled();
  });

  it('should createBook if form valid', () => {
    jest.spyOn(component.newBookForm, 'markAllAsTouched');
    component.onRegister();
    expect(component.newBookForm.markAllAsTouched).toHaveBeenCalled();

    jest.spyOn(booksService, 'createBook');
    component.newBookForm.setValue({
      title: 'test',
      author: 'test',
      resume: 'test',
      image: 'test.com',
      url: 'test.com',
      public: false,
      category: {
        [1]: true,
        [2]: true,
        [3]: false
      }
    });
    component.onRegister();
    expect(booksService.createBook).toHaveBeenCalled();
  });

  it('should redirect onCancel', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onCancel();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
