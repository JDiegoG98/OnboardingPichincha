import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  username = this.usersService.loggedUser.username;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

}
