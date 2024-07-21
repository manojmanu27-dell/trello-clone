import { SharedService } from './services/shared.service';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiCallsService } from './services/api-service/api-calls.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { HomeComponent } from "./pages/secure/home/home.component";
import { NgxLoadingModule } from "ngx-loading";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxLoadingModule, HttpClientModule, HeaderComponent, FooterComponent, HomeComponent],
  providers: [ApiCallsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui';
  constructor(private apiService: ApiCallsService, public sharedService: SharedService) {

  }
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    // Do more processing...
    if (sessionStorage.getItem("user")) {
      sessionStorage.setItem('temp', window.btoa(JSON.stringify(this.sharedService)));
    }
    // event.returnValue = false;
  }
}
