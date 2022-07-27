import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { UsersService } from "../services/users.service";

@Injectable({ providedIn: 'root' })
export class UsernameExistsValidator implements AsyncValidator {
  constructor(private usersService: UsersService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usersService.checkUsernameExists(control.value).pipe(
      map(res => (res.exists ? { usernameExists: true } : null)),
      catchError(() => of(null))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class UsernameNotExistsValidator implements AsyncValidator {
  constructor(private usersService: UsersService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usersService.checkUsernameExists(control.value).pipe(
      map(res => (res.exists ? null : { usernameNotExists: true })),
      catchError(() => of(null))
    );
  }
}
