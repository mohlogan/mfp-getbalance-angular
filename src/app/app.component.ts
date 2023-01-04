import { Component, NgZone} from '@angular/core';
declare var device;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent{

  balance: string;
  message: string;

  UserLoginChallengeHandler: WL.Client.SecurityCheckChallengeHandler;
  title = 'MobileFirst getBalance';
  constructor(public zone: NgZone) {
    document.addEventListener("deviceready", function() {
        console.log("deviceready");
    }, false);

    WL.Client.init({mfpContextRoot:"/mfp",applicationId:"com.mfp.getbalance"});
    this.MFPInitComplete();
  }


  getBalance() {
  var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance",WLResourceRequest.GET);
  resourceRequest.send().then(
     (response) => {
      console.log('-->  getBalance(): Success ', response.responseText);
      //this.balance = 'Your Balance is : ' + response.responseText;
      this.zone.run(() => this.balance = 'Your Balance is : ' + response.responseText);
     }, (error) => {
      console.log('-->  getBalance():  ERROR ', error.responseText);
      //this.balance = error.responseText;
      this.zone.run(() => this.balance = error.responseText);
     }
   )
  }

   // MFP Init complete function
   MFPInitComplete() {
    console.log('--> MFPInitComplete function called');
  }
}

