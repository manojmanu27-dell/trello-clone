import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {
    if (sessionStorage.getItem('user') && sessionStorage.getItem('temp')) {
      let sessionStr = sessionStorage.getItem('temp') || "";
      const shared: SharedService = JSON.parse(window.atob(sessionStr));
      sessionStorage.removeItem('temp');
      for (const key in shared) {
        (this as any)[key] = (shared as any)[key];
      }
    }
    console.log("the shared serice", this)
  }
  loading: boolean;
  accessToken: string;
  isUserLoggedIn: boolean = false;
  userTasks: any;
  userInfo: any

  logout(){
    sessionStorage.removeItem('user');
    for(let key in this){
      (this as any)[key] = null
    }
  }
}
