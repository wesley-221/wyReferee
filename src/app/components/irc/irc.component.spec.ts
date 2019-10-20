import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcComponent } from './irc.component';

describe('IrcComponent', () => {
  let component: IrcComponent;
  let fixture: ComponentFixture<IrcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
