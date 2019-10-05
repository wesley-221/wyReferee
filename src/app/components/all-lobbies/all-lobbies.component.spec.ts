import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLobbiesComponent } from './all-lobbies.component';

describe('AllLobbiesComponent', () => {
  let component: AllLobbiesComponent;
  let fixture: ComponentFixture<AllLobbiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLobbiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
