import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AppRoutes } from '../../config/routes.enum';
import { BooksService } from '../../services/books.service';
import { Book } from '../../interfaces/book.interface';
import { Filter } from '../../interfaces/filter.interface';
import { Category } from '../../interfaces/categories.interface';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-public-library',
  templateUrl: './public-library.component.html',
  styleUrls: ['./public-library.component.scss']
})
export class PublicLibraryComponent implements OnInit {
  userBooks: Book[] = [];
  publicBooks: Book[] = [];
  searchTerm = '';
  selectedCategories: number[] = [];
  filterSubscription!: Subscription;
  categoriesList: Category[] = [];

  constructor(
    private booksService: BooksService,
    private router: Router,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.getBooks();
    this.getCategories();
  }

  async getBooks() {
    if (this.booksService.userBooks.length == 0) {
      await lastValueFrom(this.booksService.getBooksByOwner()).then(res => {
        this.booksService.userBooks = res.slice(0, 4);
      });
    }
    if (this.booksService.publicBooks.length == 0) {
      await lastValueFrom(this.booksService.filterBooks({})).then(res => {
        this.booksService.publicBooks = res.items.filter(book => book.public).slice(0, 30);
      });
    }
    this.userBooks = this.booksService.userBooks;
    this.publicBooks = this.booksService.publicBooks;
  }

  async getCategories() {
    if (this.categoriesService.categories.length == 0) {
      await lastValueFrom(this.categoriesService.getCategories()).then(res => {
        this.categoriesService.categories = res.slice(0, 5);
      });
    }
    this.categoriesList = this.categoriesService.categories;
  }

  onSearch(event: CustomEvent) {
    this.searchTerm = event.detail.target.value;
    this.filterPublicBooks();
  }

  onClickCheckbox(event: CustomEvent) {
    if(event.detail.checked){
      this.selectedCategories.push(event.detail.value);
      this.filterPublicBooks();
      return;
    }
    this.selectedCategories = this.selectedCategories.filter(category => category != event.detail.value);
    this.filterPublicBooks();
  }

  filterPublicBooks(){
    const filter: Filter = {
      ...(this.searchTerm && {title: this.searchTerm}),
      ...(this.selectedCategories.length > 0 && { category: this.selectedCategories })
    }
    if(Object.keys(filter).length > 0){
      this.filterSubscription?.unsubscribe();
      this.filterSubscription = this.booksService.filterBooks(filter).subscribe(res => {
        this.publicBooks = res.items;
      });
      return;
    }
    this.getBooks();
  }

  onSelectBook(id: string){
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}/${id}`);
  }

  onViewMore(){
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}/${AppRoutes.BOOKS}`);
  }
}
