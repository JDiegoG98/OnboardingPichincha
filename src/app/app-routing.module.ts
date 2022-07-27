import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './config/routes.enum';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LibraryComponent } from './views/library/library.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full'
  },
  {
    path: AppRoutes.REGISTER,
    component: RegisterComponent
  },
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent
  },
  {
    path: AppRoutes.LIBRARY,
    component: LibraryComponent,
    children: [

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
