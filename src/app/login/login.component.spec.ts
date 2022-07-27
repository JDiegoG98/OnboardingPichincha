import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { InputValueAcessorDirective } from '../directives/input-value-accessor.directive';
import { UsersService } from '../services/users.service';

import { LoginComponent } from './login.component';

const mockLoginResponse = {
  access_token: 'test',
  user: {
    username: 'test',
    userId: 'test'
  }
}

class mockUsersService {
  login() { return of(mockLoginResponse) };
  checkUsernameExists() { return of({ exists: false }) }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, InputValueAcessorDirective],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [{ provide: UsersService, useClass: mockUsersService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    jest.resetAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorHelper based on username error', () => {
    const errorRequired = component.checkUsernameError();
    expect(errorRequired).toEqual('Usuario es requerido');

    component.username?.patchValue('test');
    const errorUnavailable = component.checkUsernameError();
    expect(errorUnavailable).toEqual('Usuario no existe')
  });

  it('should request login based on form valid', () => {
    jest.spyOn(component.loginForm, 'markAllAsTouched');
    component.loginForm.patchValue({
      username: 'test',
      password: 'test'
    });
    component.onLogin();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();

    jest.spyOn(usersService, 'checkUsernameExists').mockImplementation(() => of({exists: true}));
    component.loginForm.patchValue({
      username: 'ksuarez',
      password: 'adm12345'
    });
    component.onLogin();
    expect(usersService.loggedUser).toEqual(mockLoginResponse.user);
  });
});
