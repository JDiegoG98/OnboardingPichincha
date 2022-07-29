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
  userBooks: Book[] = [];
  publicBooks: Book[] = [];

  constructor(private http: HttpClient) { }

  getBooksByOwner(): Observable<Book[]> {
    return this.http.get<Book[]>(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE);
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${environment.apiUrl}${Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE}/${id}`);
  }

  filterBooks(filters: Filter): Observable<FilteredBooksResponse> {
    return this.http.post<FilteredBooksResponse>(environment.apiUrl + Endpoints.FILTER_BOOKS, filters);
  }

  createBook(book: Book): Observable<any> {
    return this.http.post(environment.apiUrl + Endpoints.GET_BOOKS_BY_OWNER_OR_CREATE, book);
  }
}
