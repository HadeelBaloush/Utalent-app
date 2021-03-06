import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  user = {}; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { }
  
  signin() {
    this.authService.signin(this.user).subscribe(data => {
      if(data){
        localStorage.setItem('com.userId',JSON.stringify(data.id))
        localStorage.setItem('com.username',JSON.stringify(data.username))
        this.router.navigate(['/users/'+ JSON.stringify(data.username)])
      }
    })
  }
}


