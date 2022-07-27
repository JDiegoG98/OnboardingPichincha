import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AppRoutes } from '../../config/routes.enum';
import { Book } from '../../interfaces/book.interface';
import { Filter } from '../../interfaces/filter.interface';
import { SelectItem } from '../../interfaces/select-item.interface';
import { BooksService } from '../../services/books.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  categories: SelectItem[] = [{ label: 'Seleccione una categoría', value: null }];
  books: Book[] = [];
  selectedCategory: number | null = null;
  searchTerm = '';
  filterSubscription!: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private booksService: BooksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getBooks();
  }

  async getCategories() {
    if (this.categoriesService.categories.length == 0) {
      await lastValueFrom(this.categoriesService.getCategories()).then(res => {
        this.categoriesService.categories = res.slice(0, 5);
      });
    }
    const categoriesToItems = this.categoriesService.categories.map(category => {
      return {
        label: category.description,
        value: category.id
      }
    });
    this.categories = [...this.categories, ...categoriesToItems];
  }

  async getBooks() {
    if (this.booksService.books.length == 0) {
      await lastValueFrom(this.booksService.getBooksByOwner()).then(res => {
        this.booksService.books = res;
      });
    }
    this.books = this.booksService.books;
  }

  onAddBook() {
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}/${AppRoutes.NEW_BOOK}`);
  }

  onSearch(event: CustomEvent) {
    this.searchTerm = event.detail.target.value;
    if (event.detail.target.value.length > 0) {
      const filter: Filter = {
        title: event.detail.target.value,
        ...(this.selectedCategory && { category: [this.selectedCategory] })
      }
      this.filterSubscription?.unsubscribe();
      this.filterSubscription = this.booksService.filterBooks(filter).subscribe(res => {
        this.books = res.items;
      });
    } else {
      this.getBooks();
    }
  }

  handleSelectedItem(event: CustomEvent) {
    this.selectedCategory = event.detail.value;
    if (this.selectedCategory) {
      const filter: Filter = {
        ...(this.searchTerm.length > 0 && { title: this.searchTerm }),
        category: [this.selectedCategory!]
      };
      this.filterSubscription?.unsubscribe();
      this.filterSubscription = this.booksService.filterBooks(filter).subscribe(res => {
        this.books = res.items;
      });
    } else {
      this.getBooks();
    }
  }
}
