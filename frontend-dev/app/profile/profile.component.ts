import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    
    user: User;

    constructor(private userService: UserService) {
        this.user = this.userService.getUser(); 
    }

    ngOnInit() {
    }

    get userId() {
        return this.user ? this.user.email : '';
    }

}
