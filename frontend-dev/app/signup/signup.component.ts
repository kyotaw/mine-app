import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    email = new FormControl('', [Validators.required, Validators.email]);
    password: any = {};
    errorMessage: string = ' ';
    
    hide = true;
    hide_confirm = true;
    hasPassowrdDoNotMatchError = false;
    loading = false;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
    }

    signUp() {
        if (this.email.invalid || !this.password.master || this.hasPassowrdDoNotMatchError) {
            return;
        }
        this.loading = true;
        this.userService.signUp(this.email.value, this.password.master)
            .subscribe(user => {
                this.router.navigateByUrl('/login');
            },
            error => {
                this.loading = false;
                if (error.error.errorCode === 501) {
                    this.errorMessage = 'The email address is aleady used';
                }
            });
    
    }

    validatePassword() {
        this.hasPassowrdDoNotMatchError = this.password.master != this.password.confirm;
    }
    
    get passwordDoNotMatchMessage() {
        return "Password do not match";
    }
}
