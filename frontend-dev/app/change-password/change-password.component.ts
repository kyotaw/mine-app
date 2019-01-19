import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    password: any = {};
    errorMessage: string = ' ';
    
    hide_cur = true;
    hide_new = true;
    hide_confirm = true;
    hasPassowrdDoNotMatchError = false;
    loading = false;

    constructor(
        private userService: UserService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
    }

    updatePassword() {
        if (!this.password.cur || !this.password.new || this.hasPassowrdDoNotMatchError) {
            return;
        }
        this.loading = true;
        this.userService.updatePassword(this.password.cur, this.password.new)
            .subscribe(success=> {
                this.goBack();
            },
            error => {
                this.loading = false;
                this.errorMessage = 'Faild to update password';
            });
    
    }

    goBack() {
        this.location.back();
    }

    validatePassword() {
        this.hasPassowrdDoNotMatchError = this.password.new != this.password.confirm;
    }
    
    get passwordDoNotMatchMessage() {
        return "Password do not match";
    }
}
