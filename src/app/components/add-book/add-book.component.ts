import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Book } from '../../interfaces/book.interface';
import { BooksService } from '../../services/books.service';
import { AppRoutes } from '../../config/routes.enum';
import { Category } from '../../interfaces/categories.interface';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  categoriesList: Category[] = [];
  newBookForm = this.fb.group({
    title: [null, Validators.required],
    author: [null, Validators.required],
    resume: [null, Validators.required],
    image: [null, Validators.required],
    url: [null, Validators.required],
    public: [false, Validators.required],
    category: this.fb.group({})
  });
  loading = false;
  bookToEdit: Book | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private router: Router,
    private booksService: BooksService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCategoriesAndBook();
  }

  get category() { return this.newBookForm.get('category') };
  get url() { return this.newBookForm.get('url') };
  get image() { return this.newBookForm.get('image') };

  async getCategoriesAndBook() {
    if (this.categoriesService.categories.length == 0) {
      await lastValueFrom(this.categoriesService.getCategories()).then(res => {
        this.categoriesService.categories = res.slice(0, 5);
      });
    }
    this.categoriesList = this.categoriesService.categories;
    this.newBookForm = this.fb.group({
      title: [null, Validators.required],
      author: [null, Validators.required],
      resume: [null, Validators.required],
      image: [null, [Validators.required, Validators.pattern('[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')]],
      url: [null, [Validators.required, Validators.pattern('[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')]],
      public: [false, Validators.required],
      category: this.fb.group({
        ...(this.categoriesList.reduce<{}>(
          (prev, curr) => { return { ...prev, [curr.id]: [false] } }, {}
        ))
      },
        {
          validators: [this.checkAtLeastOneSelected()]
        })
    });
    if (this.route.snapshot.paramMap.get('bookId')) {
      this.booksService.getBookById(this.route.snapshot.paramMap.get('bookId')!).subscribe({
        next: res => {
          this.bookToEdit = res;
          this.newBookForm.patchValue({
            title: this.bookToEdit.title,
            author: this.bookToEdit.author,
            resume: this.bookToEdit.resume,
            image: this.bookToEdit.image,
            url: this.bookToEdit.url,
            public: this.bookToEdit.public,
            category: this.bookToEdit.category.reduce((prev, curr) => {
              const valueObject = {...prev, [curr]: true};
              return valueObject;
            }, {})
          });
        },
        error: error => console.error(error)
      });
    }
  }

  checkErrorMessage(control: AbstractControl) {
    const controlName = Object.keys(control.parent!.controls).find(name => control === this.newBookForm.get(name));
    if (control.errors && control.errors['required']) {
      return `${controlName!.charAt(0).toUpperCase() + controlName!.slice(1)} es requerida`;
    }
    return 'URL tiene formato inválido';
  }

  onClickCheckbox(categoryId: number) {
    this.category!.markAsTouched();
    this.newBookForm.patchValue({
      category: {
        [categoryId]: !this.newBookForm.get(['category', categoryId])!.value
      }
    });
  }

  onClickCheckboxPublic() {
    this.newBookForm.controls['public'].setValue(!this.newBookForm.controls['public'].value);
  }

  checkAtLeastOneSelected() {
    return (formGroup: AbstractControl) => {
      const selectedCategoriesAmount = Object.values(formGroup.value).filter(value => value === true);
      if (selectedCategoriesAmount.length > 0) {
        return null;
      } else {
        return { atLeastOneSelected: false };
      }
    };
  }

  onRegister() {
    if (this.newBookForm.invalid) {
      this.newBookForm.markAllAsTouched();
      this.newBookForm.markAsDirty();
      return;
    }
    const book: Book = {
      ...this.newBookForm.getRawValue(),
      category: Object.keys(this.newBookForm.getRawValue().category).filter(key => this.newBookForm.getRawValue().category[key] === true)
    };
    this.booksService.createBook(book).subscribe({
      next: res => {
        alert('Libro creado exitosamente');
        this.router.navigateByUrl(AppRoutes.LIBRARY);
      },
      error: error => {
        console.error(error);
      }
    })
  }

  onCancel() {
    this.router.navigateByUrl(AppRoutes.LIBRARY);
  }

}
