import { SharedService } from './../../../services/shared.service';
import { ApiCallsService } from './../../../services/api-service/api-calls.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
declare var google: any;

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
  constructor(private router: Router, private zone: NgZone, private apiService: ApiCallsService, private sharedService: SharedService) {
    if (this.router.url === '/signup') {
      this.showForm = true;
    }
  }

  ngOnInit(): void {
    console.log("the google accounts are", google)
    google.accounts.id.initialize(
      {
        client_id: environment.clientId,
        callback: (resp: any) => {
          console.log("the respons is", resp)
          this.apiService.googleLogin(resp).subscribe({
            next: (res) => {
              console.log("the respons is", res);
              if (res) {
                this.zone.run(() => this.setupUserData(res));
              }
            },
            error: (err) => {
              console.error("Error occuresd in setting up google login", err);
              this.sharedService.isUserLoggedIn = false;
            }
          })
        }
      }
    )
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "filled_blue",
      size: "large",
      shape: 'rectangle',
      maxWidth: 350
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
    this.apiService.signup(obj).subscribe({
      next: (res) => {
        console.log("the response is", res);
        this.setupUserData(res);
      },
      error: (err) => {
        console.error("Error occuresd in setting up signup", err);
        this.sharedService.isUserLoggedIn = false;
      }
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
        this.setupUserData(res);
      },
      error: (err) => {
        console.error("Error occuresd in setting up login", err);
        this.sharedService.isUserLoggedIn = false;
      }
    })
  }

  setupUserData(res: any) {
    sessionStorage.setItem('user', 'true')
    this.sharedService.isUserLoggedIn = true;
    this.router.navigateByUrl('/home');
    this.sharedService.accessToken = res.accessToken;
    this.sharedService.userInfo = res.userInfo;
    this.sharedService.userTasks = res.taskList;
  }
}
