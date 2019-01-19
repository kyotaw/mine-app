import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email = new FormControl('', [Validators.required, Validators.email]);
    password: string;
    errorMessage: string = ' ';

    hide = true;
    hide_confirm = true;
    loading = false;

    returnUrl: string;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.userService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/arb';
    }

    login() {
        if (this.email.invalid || !this.password) {
            return;
        }
        this.loading = true;
        this.userService.login(this.email.value, this.password)
            .subscribe(user => {
                this.router.navigateByUrl(this.returnUrl);
                this.loading = false;
            },
            error => {
                this.errorMessage = 'Authentication failed'
                this.loading = false;
            });
    }


    get emailErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' : '';
    }

}
