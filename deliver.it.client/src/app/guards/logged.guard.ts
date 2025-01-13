import { CanActivate, Router } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "../auth.service";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(isAdmin => {
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['/not-logged-in']);
          return false;
        }
      })
    );
  }
}
