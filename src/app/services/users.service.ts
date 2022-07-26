import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { ExistsResponse } from '../interfaces/exists-response.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  checkUsernameExists(username: string){
    return this.http.get<ExistsResponse>(environment.apiUrl + Endpoints.CHECK_USERNAME_EXISTS + username);
  }

  createUser(user: User){
    return this.http.post(environment.apiUrl + Endpoints.CREATE_USER, user);
  }
}
