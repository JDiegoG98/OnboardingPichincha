import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutes } from '../../config/routes.enum';
import { UsersService } from '../../services/users.service';
import { UsernameNotExistsValidator } from '../../validators/username-exists.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: [null, {
      validators: [Validators.required],
      asyncValidators: [this.usernameNotExistsValidator.validate.bind(this.usernameNotExistsValidator)],
      updateOn: 'blur'
    }],
    password: [null, [Validators.required]]
  });
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usernameNotExistsValidator: UsernameNotExistsValidator,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  get username() { return this.loginForm.get('username'); }

  checkUsernameError() {
    if (this.username!.errors && this.username!.errors['required']) {
      return 'Usuario es requerido';
    } else {
      return 'Usuario no existe'
    }
  }

  onLogin() {
    if(this.loginForm.valid){
      this.loading = true;
      this.usersService.login(this.loginForm.value).subscribe({
        next: res => {
          this.loading = false;
          this.errorMessage = '';
          sessionStorage.setItem('token', res.access_token);
          sessionStorage.setItem('userId', res.user.userId);
          sessionStorage.setItem('username', res.user.username);
          this.usersService.loggedUser = res.user;
          this.router.navigateByUrl(AppRoutes.LIBRARY);
        },
        error: error => {
          this.loading = false;
          console.error(error);
          this.errorMessage = error.error.message;
        }
      })
    }else{
      this.loginForm.markAllAsTouched();
      this.loginForm.markAsDirty();
    }
  }
}
