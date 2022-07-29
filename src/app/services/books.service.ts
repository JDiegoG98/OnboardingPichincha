import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getBooksByOwner(): Observable<Book[]> {
    const headers = this.getHeaders();
    return this.http.get<Book[]>(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE, { headers });
  }

  getBookById(id: string): Observable<Book> {
    const headers = this.getHeaders();
    return this.http.get<Book>(`${environment.apiUrl}${Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE}/${id}`, { headers });
  }

  filterBooks(filters: Filter): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<FilteredBooksResponse>(environment.apiUrl + Endpoints.FILTER_BOOKS, filters, { headers });
  }

  createBook(book: Book): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE, book, { headers });
  }
}
