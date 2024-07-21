import { SharedService } from './../shared.service';
import { Injectable } from '@angular/core';
import { BackendService } from '../BackendService';
import { AbstractHttpService } from '../abstract-http/abstract-http-service.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpReqArgs } from '../abstract-http/Http-req-args';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  headers: any;
  constructor(private abstractHttpService: AbstractHttpService, private sharedService: SharedService) { }
  setHeaders() {
    this.headers = new HttpHeaders({
      "access-token": this.sharedService.accessToken
    })
  }

  public signup(input: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.signup;
    httpReq.headers = new HttpHeaders();
    return this.abstractHttpService.post$(httpReq, input);
  }

  public login(input: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.login;
    httpReq.headers = new HttpHeaders();
    return this.abstractHttpService.post$(httpReq, input);
  }

  public fetchTasks(id: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.fetchTasks + id;
    this.setHeaders();
    httpReq.headers = this.headers;
    return this.abstractHttpService.get$(httpReq);
  }

  public createTask(input: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.createTask;
    this.setHeaders();
    httpReq.headers = this.headers;
    return this.abstractHttpService.post$(httpReq, input);
  }

  public googleLogin(input: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.googleLogin;
    this.setHeaders();
    httpReq.headers = this.headers;
    return this.abstractHttpService.post$(httpReq, input);
  }

  public modifyTask(input: any): Observable<any> {
    let httpReq = new HttpReqArgs();
    httpReq.url = BackendService.modifyTask;
    this.setHeaders();
    httpReq.headers = this.headers;
    return this.abstractHttpService.post$(httpReq, input);
  }
}
