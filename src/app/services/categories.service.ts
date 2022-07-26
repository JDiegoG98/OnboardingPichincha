import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Category } from '../interfaces/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: Category[] = [];

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + Endpoints.GET_CATEGORIES);
  }
}
