import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

    user: User;
    errorMessage: string = ' ';
    loading = false;

    constructor(
        private userService: UserService,
        private location: Location,
        private router: Router) {
        this.user = this.userService.getUser();
    }

    ngOnInit() {
    }

    goBack() {
        this.location.back();
    }

    deleteUser() {
        this.loading = true;
        this.userService.delete(this.user.userId).subscribe(success => {
            this.loading = false;
            if (success) {
                this.userService.logout();
                this.router.navigateByUrl('/');
            } else {
                this.errorMessage = 'Faild to delete account';
            }
        },
        error => {
            this.loading = false;
            this.errorMessage = 'Faild to delete account';
        });
    }
    
    get userId() {
      return this.user ? this.user.email : '';
    }

}
