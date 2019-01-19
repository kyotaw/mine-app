import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbPositionListComponent } from './arb-position-list.component';

describe('ArbPositionListComponent', () => {
  let component: ArbPositionListComponent;
  let fixture: ComponentFixture<ArbPositionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArbPositionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbPositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
