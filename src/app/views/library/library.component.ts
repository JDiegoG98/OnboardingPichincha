import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../config/routes.enum';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  username = this.usersService.loggedUser.username;

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  onClickLibrary(){
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}`);
  }

  onClickMyBooks(){
    this.router.navigateByUrl(`${AppRoutes.LIBRARY}/${AppRoutes.BOOKS}`);
  }

}
