import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Category } from '../../interfaces/categories.interface';
import { User } from '../../interfaces/user.interface';
import { CategoriesService } from '../../services/categories.service';
import { UsersService } from '../../services/users.service';
import { UsernameExistsValidator } from '../../validators/username-exists.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  categoriesList: Category[] = [];
  loading = false;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private usernameExistsValidator: UsernameExistsValidator,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      passwordConfirm: [null, Validators.required],
      categories: this.fb.group({})
    });
    this.getCategories();
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get passwordConfirm() { return this.registerForm.get('passwordConfirm'); }
  get categories() { return this.registerForm.get('categories') as FormGroup; }

  async getCategories() {
    if (this.categoriesService.categories.length == 0) {
      await lastValueFrom(this.categoriesService.getCategories()).then(res => {
        this.categoriesService.categories = res.slice(0, 5);
      });
    }
    this.categoriesList = this.categoriesService.categories;
    this.registerForm = this.fb.group({
      username: [null, {
        validators: [Validators.required],
        asyncValidators: [this.usernameExistsValidator.validate.bind(this.usernameExistsValidator)],
        updateOn: 'blur'
      }],
      email: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,64})")]],
      passwordConfirm: [null, [Validators.required, this.checkPasswordConfirm()]],
      categories: this.fb.group({
        ...(this.categoriesList.reduce<{}>(
          (prev, curr) => { return { ...prev, [curr.id]: [false] } }, {}
        ))
      },
        {
          validators: [this.checkAtLeastThreeSelected()]
        })
    });
  }

  onClickCheckbox(categoryId: number) {
    this.categories!.markAsTouched();
    this.registerForm.patchValue({
      categories: {
        [categoryId]: !this.registerForm.get(['categories', categoryId])!.value
      }
    });
  }

  checkUsernameError() {
    if (this.username!.errors && this.username!.errors['required']) {
      return 'Usuario es requerido';
    } else {
      return 'Usuario no disponible'
    }
  }

  checkPasswordError() {
    if (this.password!.errors && this.password!.errors['required']) {
      return 'Contraseña es requerida';
    } else {
      return 'Contraseña debe tener 8 caracteres, mayúscula, número y especial'
    }
  }

  checkAtLeastThreeSelected() {
    return (formGroup: AbstractControl) => {
      const selectedCategoriesAmount = Object.values(formGroup.value).filter(value => value === true);
      if (selectedCategoriesAmount.length > 2) {
        return null;
      } else {
        return { atLeastThreeSelected: false };
      }
    };
  }

  checkPasswordConfirm() {
    return (control: AbstractControl) => {
      if (control.value === this.registerForm.controls['password'].value) {
        return null;
      } else {
        return { passwordMatch: false };
      }
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      const user: User = {
        name: this.username!.value,
        email: this.email!.value,
        password: this.password!.value,
        category: this.categoriesList.filter(category => this.categories.get(category.id.toString())!.value === true)
      }
      this.usersService.createUser(user).subscribe({
        next: res => {
          this.loading = false;
          alert('Usuario creado exitosamente');
        },
        error: error => console.error(error)
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.registerForm.markAsDirty();
    }
  }
}
