import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Auth } from "../config/auth.enum";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('books')){
      const token = sessionStorage.getItem('token');
      const authReq = req.clone({ setHeaders: { Authorization: Auth.BEARER + ' ' + token } });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
