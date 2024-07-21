import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class AbstractHttpService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  public get$(request: any): Observable<any> {
    this.sharedService.loading = true;
    return this.http.get(request.url, request).pipe(
      timeout(120000),
      tap((res) => {
        this.sharedService.loading = false;
      }),
      catchError((error: any) => this.handleError(error))
    )
  }
  public post$(request: any, body: any): Observable<any> {
    this.sharedService.loading = true;
    return this.http.post(request.url, body, request).pipe(
      timeout(120000),
      tap((res) => {
        this.sharedService.loading = false;
      }),
      catchError((error: any) => this.handleError(error))
    )
  }

  handleError(error: any): Observable<any> {
    return throwError(() => error);
  }
}
