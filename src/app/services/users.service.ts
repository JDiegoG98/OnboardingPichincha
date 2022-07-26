import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Credentials } from '../interfaces/credentials.interface';
import { ExistsResponse } from '../interfaces/exists-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { User, UserInfo } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  loggedUser: UserInfo = {
    userId: sessionStorage.getItem('userId')!,
    username: sessionStorage.getItem('username')!
  };

  constructor(private http: HttpClient) {}

  checkUsernameExists(username: string): Observable<ExistsResponse>{
    return this.http.get<ExistsResponse>(environment.apiUrl + Endpoints.CHECK_USERNAME_EXISTS + username);
  }

  createUser(user: User): Observable<any>{
    return this.http.post(environment.apiUrl + Endpoints.CREATE_USER, user);
  }

  login(credentials: Credentials): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(environment.apiUrl + Endpoints.LOGIN, credentials);
  }
}
