import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    userId: 'default',
    username: 'default'
  };

  constructor(private http: HttpClient) { }

  checkUsernameExists(username: string){
    return this.http.get<ExistsResponse>(environment.apiUrl + Endpoints.CHECK_USERNAME_EXISTS + username);
  }

  createUser(user: User){
    return this.http.post(environment.apiUrl + Endpoints.CREATE_USER, user);
  }

  login(credentials: Credentials){
    return this.http.post<LoginResponse>(environment.apiUrl + Endpoints.LOGIN, credentials);
  }
}
