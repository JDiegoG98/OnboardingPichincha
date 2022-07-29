import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '../../config/routes.enum';
import { Book } from '../../interfaces/book.interface';
import { Category } from '../../interfaces/categories.interface';
import { BooksService } from '../../services/books.service';
import { CategoriesService } from '../../services/categories.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent implements OnInit {
  book: Book | null = null;
  userId = '';
  categories: Category[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private location: Location,
    private usersService: UsersService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.userId = this.usersService.loggedUser.userId;
    const bookId = this.route.snapshot.paramMap.get('bookId');
    this.booksService.getBookById(bookId!).subscribe({
      next: res => {
        this.loading = false;
        this.book = res;
        this.categories = this.categoriesService.categories.filter(category => this.book!.category.find(id => category.id == id));
      },
      error: error => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  onReturn(){
    this.location.back();
  }

  onEdit(){
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}/${AppRoutes.NEW_BOOK}/${this.book!.id}`);
  }
}
