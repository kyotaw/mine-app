import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { MineAppApiService } from './mine-app-api.service';
import { User } from '../models/user.model';

export interface UserServiceDelegate {
    loggedIn(user: User): void;
    loggedOut(user: User): void;
}

@Injectable()
export class UserService {

    delegates: UserServiceDelegate[] = [];

    constructor(
        private mineAppApi: MineAppApiService
    ) {}

    login(email: string, password: string) {
        return this.mineAppApi.login(email, password).map(json => {
            let data = json['data'];
            let userData = data['user'];
            let accessToken = data['accessToken'];
            userData.accessToken = accessToken;
            const user = this._createUser(userData);
            for (let delegate of this.delegates) {
                delegate.loggedIn(user);
            }
            return user;
        });
    }

    logout() {
        const user = this.getUser();
        localStorage.removeItem('currentUser');
        for (let delegate of this.delegates) {
            delegate.loggedOut(user);
        }
    }
    
    signUp(email: string, password: string) {
        return this.mineAppApi.signUp(email, password).map(json => {
            return json['status'] === 'success';
        });
    }

    certificate(certCode: string) {
        return this.mineAppApi.certificate(certCode).map(json => {
            return json['status'] === 'success';
        });
    }

    getUser() {
        const json = localStorage.getItem('currentUser');
        if (json) {
            const user = JSON.parse(json);
            return this._createUser(user);
        } else {
            return null;
        }
    }

    delete(userId: string) {
        return this.mineAppApi.deleteUser(userId).map(json => {
            return json['status'] === 'success';
        });
    }

    updatePassword(curPassword: string, newPassword: string) {
        return this.mineAppApi.updatePassword(curPassword, newPassword).map(json => {
            return json['status'] === 'success';
        });
    }

    addListner(delegate: UserServiceDelegate) {
        this.delegates.push(delegate);
    }

    _createUser(json: any) {
        const user = new User(json['email'], json['userId'], json['accessToken']);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
}
