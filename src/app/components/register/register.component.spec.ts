import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputValueAcessorDirective } from '../../directives/input-value-accessor.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/categories.interface';
import { of } from 'rxjs';
import { UsersService } from '../../services/users.service';

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

class mockUsersService {
  createUser(){ return of(true)}
  checkUsernameExists(){return of({exists: false})}
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let categoriesService: CategoriesService;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent, InputValueAcessorDirective],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CategoriesService, useClass: mockCategoriesService },
        { provide: UsersService, useClass: mockUsersService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    usersService = TestBed.inject(UsersService);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getCategories from request and store them', async () => {
    await component.getCategories();
    expect(categoriesService.categories).toEqual(mockCategories);
    expect(component.categoriesList).toEqual(categoriesService.categories);
  });

  it('should patchValue onClickCheckbox', () => {
    jest.spyOn(component.registerForm, 'patchValue');
    component.onClickCheckbox(1);
    expect(component.registerForm.patchValue).toHaveBeenCalled();
  });

  it('should set errorHelper based on username error', () => {
    const errorRequired = component.checkUsernameError();
    expect(errorRequired).toEqual('Usuario es requerido');

    jest.spyOn(usersService, 'checkUsernameExists').mockImplementation(() => of({exists: true}));
    component.username?.patchValue('ksuarez');
    const errorUnavailable = component.checkUsernameError();
    expect(errorUnavailable).toEqual('Usuario no disponible')
  });

  it('should set errorHelper based on password error', () => {
    const errorRequired = component.checkPasswordError();
    expect(errorRequired).toEqual('Contraseña es requerida');

    component.password?.patchValue('test');
    const errorUnavailable = component.checkPasswordError();
    expect(errorUnavailable).toEqual('Contraseña debe tener 8 caracteres, mayúscula, número y especial')
  });

  it('should create user onRegister or mark touched based on valid', () => {
    component.registerForm.patchValue({
      username: 'test',
      email: 'test',
      password: 'Testing_1',
      passwordConfirm: 'Testing_123',
      categories: {
        [mockCategories[0].id]: true,
        [mockCategories[1].id]: true,
        [mockCategories[2].id]: true,
      }
    });
    component.onRegister();
    expect(component.registerForm.touched).toBe(true);

    jest.spyOn(usersService, 'createUser');
    component.registerForm.patchValue({
      username: 'test',
      email: 'test',
      password: 'Testing_1',
      passwordConfirm: 'Testing_1',
      categories: {
        [mockCategories[0].id]: true,
        [mockCategories[1].id]: true,
        [mockCategories[2].id]: true,
      }
    });
    component.onRegister();
    expect(usersService.createUser).toHaveBeenCalled();
  });
});
