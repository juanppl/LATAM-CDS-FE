import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/Category';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public getListOfCategories(): Observable<Category[]> {
    const url = `${environment.api}Categories/get-list-of-categories`;
    return this.http.get<Category[]>(url).pipe(
      catchError((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error when getting list of categories',
          html: `${err.error.Message} ${err.error.Id}`
        });
        return of([]);
      })
    );
  }
}
