import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Endpoints } from '../config/endpoints.enum';
import { Book, FilteredBooksResponse } from '../interfaces/book.interface';
import { Filter } from '../interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  books: Book[] = [];

  constructor(private http: HttpClient) { }

  getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
  }

  getBooksByOwner() {
    const headers = this.getHeaders();
    return this.http.get<Book[]>(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER, { headers });
  }

  filterBooks(filters: Filter) {
    const headers = this.getHeaders();
    return this.http.post<FilteredBooksResponse>(environment.apiUrl + Endpoints.FILTER_BOOKS, filters, { headers });
  }
}
