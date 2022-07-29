import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LibraryComponent } from './library.component';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect onClickLibrary', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onClickLibrary();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should redirect onClickMyBooks', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.onClickMyBooks();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
