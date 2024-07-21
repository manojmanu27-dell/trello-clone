declare var google: any
import { SharedService } from './../../../services/shared.service';
import { ApiCallsService } from './../../../services/api-service/api-calls.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  showForm: boolean;
  errObj: any = {};
  userName: string;
  emailId: string;
  password: string;
  scPassword: string;
  constructor(private router: Router, private apiService: ApiCallsService, private sharedService: SharedService) {
    if (this.router.url === '/signup') {
      this.showForm = true;
    }
  }

  ngOnInit(): void {
    console.log("the google accounts are",google)
    google.accounts.id.initialize(
      {
        client_id: '674662451750-5rg68qofgki65l332bdtlvi01v64k6k4.apps.googleusercontent.com',
        callback: (resp: any) => {
          console.log("the respons is",resp)
          this.apiService.googleLogin(resp).subscribe()
        }
      }
    )
    google.accounts.id.renderButton(document.getElementById("google-btn"),{
      theme:"filled_blue",
      size:"large",
      shape:'rectangle',
      maxWidth:350
    })


  }
  showSignupForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.router.navigateByUrl('signup');
    } else {
      this.router.navigateByUrl('login');
    }
    this.reset();
  }

  reset() {
    this.password = "";
    this.scPassword = "";
    this.userName = "";
  }

  hideAndShowPwd(type: string) {
    if (this.errObj[type]) {
      this.errObj[type] = false;
    } else {
      this.errObj[type] = true;
    }
  }

  userSignup() {
    let obj = {
      "userName": this.userName,
      "userEmail": this.emailId,
      "password": this.password,
      "confirmPassword": this.scPassword
    }
    this.apiService.signup(obj).subscribe((res) => {
      console.log("the response is", res);
    })
  }

  userLogin() {
    let obj = {
      "userEmail": this.emailId,
      "password": this.password,
    }
    this.apiService.login(obj).subscribe({
      next: (res) => {
        console.log("the response is", res);
        sessionStorage.setItem('user', 'true')
        this.sharedService.isUserLoggedIn = true;
        this.router.navigateByUrl('home');
        this.sharedService.accessToken = res.accessToken;
        this.sharedService.userInfo = res.userInfo;
        this.sharedService.userTasks = res.tasksList;
      },
      error: (err) => {
        this.sharedService.isUserLoggedIn = false;
      }
    })
  }

}
