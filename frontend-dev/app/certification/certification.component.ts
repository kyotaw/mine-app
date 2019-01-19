import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css']
})
export class CertificationComponent implements OnInit {

    errorMessage: string;
    completeMessage: string;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router) {
        this.errorMessage = '';
        this.completeMessage = '';
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const code = params.code;
            if (code) {
                this.userService.certificate(code)
                    .subscribe(() => {
                        this.completeMessage = 'Your account is activated ! Move to login automatically.';
                        let time = setTimeout(() => {
                            this.router.navigateByUrl('/login');
                        }, 5000);
                    },
                    error => {
                        this.errorMessage = 'Certification failed. Please sign up again.';
                    });
            } else {
                this.errorMessage = 'Invalid code';
            }
        });
    }

}
