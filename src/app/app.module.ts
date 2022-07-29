import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValueAcessorDirective } from './directives/input-value-accessor.directive';
import { LibraryComponent } from './views/library/library.component';
import { BooksComponent } from './components/books/books.component';
import { BookVisualizerComponent } from './components/book-visualizer/book-visualizer.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BookInfoComponent } from './components/book-info/book-info.component';
import { PublicLibraryComponent } from './components/public-library/public-library.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    InputValueAcessorDirective,
    LibraryComponent,
    BooksComponent,
    BookVisualizerComponent,
    AddBookComponent,
    BookInfoComponent,
    PublicLibraryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
