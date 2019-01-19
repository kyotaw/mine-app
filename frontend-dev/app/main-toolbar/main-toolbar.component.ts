import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, UserServiceDelegate } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css']
})
export class MainToolbarComponent implements OnInit, UserServiceDelegate {

    isLoggedIn: boolean ;
    userId: string;

    constructor(
        private userService: UserService,
        private router: Router) {

        this.isLoggedIn = false;
        this.userId = '';
    }

    ngOnInit() {
        this.userService.addListner(this);
        const user = this.userService.getUser();
        if (user) {
            this.isLoggedIn = true;
            this.userId = user.email;
        }
    }

    logout() {
        this.userService.logout();
        this.router.navigateByUrl('/');
    }

    // UserServiceDelegate
    loggedIn(user: User) {
        this.isLoggedIn = true; 
        this.userId = user.email;
    }

    loggedOut(user: User) {
        this.isLoggedIn = false;
        this.userId = '';
    }
}
