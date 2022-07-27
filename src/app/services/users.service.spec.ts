import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Credentials } from '../interfaces/credentials.interface';
import { ExistsResponse } from '../interfaces/exists-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { User } from '../interfaces/user.interface';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request username check on checkUsernameExist', () => {
    const mockExists: ExistsResponse =
    {
      exists: false
    };
    service.checkUsernameExists('test').subscribe(res => {
      expect(res.exists).toBeTruthy();
      expect(res).toEqual(mockExists);
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.CHECK_USERNAME_EXISTS + 'test');
    expect(req.request.method).toBe("GET");
    req.flush(mockExists);
  });

  it('should request user creation on createUser', () => {
    const mockUser: User =
    {
      name: 'test',
      email: 'test',
      password: 'test',
      category: []
    };
    const mockResponse = {
      id: 'test123',
      status: 'success'
    }
    service.createUser(mockUser).subscribe((res: any) => {
      expect(res.id).toBe('test123');
      expect(res.status).toBe('success');
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.CREATE_USER);
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });

  it('should request login on login', () => {
    const mockCredentials: Credentials =
    {
      username: 'test',
      password: 'test'
    };
    const mockResponse: LoginResponse = {
      user: {
        userId: 'test',
        username: 'test'
      },
      access_token: 'test',
      tokenType: 'test'
    }
    service.login(mockCredentials).subscribe((res: any) => {
      expect(res.access_token).toBe('test');
      expect(res.user.username).toBe('test');
    });

    const req = http.expectOne(environment.apiUrl + Endpoints.LOGIN);
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });
});
