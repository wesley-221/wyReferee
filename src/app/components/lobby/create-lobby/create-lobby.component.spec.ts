import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLobbyComponent } from './create-lobby.component';

describe('CreateLobbyComponent', () => {
  let component: CreateLobbyComponent;
  let fixture: ComponentFixture<CreateLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
