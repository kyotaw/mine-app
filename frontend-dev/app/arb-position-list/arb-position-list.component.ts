import { Component, OnInit } from '@angular/core';

import { ArbPosition } from '../models/arb-position.model';
import { ArbPositionService } from '../services/arb-position.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-arb-position-list',
  templateUrl: './arb-position-list.component.html',
  styleUrls: ['./arb-position-list.component.css']
})
export class ArbPositionListComponent implements OnInit {
    arbPositions: ArbPosition[];
    selectedArbPositions: ArbPosition[];

    constructor(
        private arbPositionService: ArbPositionService,
        private userService: UserService) {
        this.arbPositions= [];
    }

    ngOnInit() {
        let user = this.userService.getUser();
        this.arbPositionService.getArbPositions(user.userId).subscribe(arbPositions => {
            this.arbPositions = arbPositions;
            this,arbPositions.sort((a, b) => {
                if (a.openTimestamp < b.openTimestamp) return 1;
                if (a.openTimestamp > b.openTimestamp) return -1;
                return 0;
            });
            this.selectedArbPositions= this.arbPositions;
        });
    }

    get allArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.length;
        } else {
            return 0;
        }
    }

    get openArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.filter(s => { return s.isOpen; }).length;
        } else {
            return 0;
        }
    }

    get closedArbPositionCount() {
        if (this.arbPositions) {
            return this.arbPositions.filter(s => { return s.isClosed; }).length;
        } else {
            return 0;
        }
    }

    selectAll() {
        this.selectedArbPositions = this.arbPositions;
    }

    selectActiveArbPositions() {
        this.selectedArbPositions = this._getActiveArbPositions();
    }

    selectTerminatedArbPositions() {
        this.selectedArbPositions = this._getTerminatedArbPositions();
    }

    _getActiveArbPositions() {
        return this.arbPositions.filter(s => { return s.isOpen; });
    }

    _getTerminatedArbPositions() {
        return this.arbPositions.filter(s => { return s.isClosed; });
    }
}
