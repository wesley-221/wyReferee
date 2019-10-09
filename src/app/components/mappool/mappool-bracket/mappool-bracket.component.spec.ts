import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolBracketComponent } from './mappool-bracket.component';

describe('MappoolBracketComponent', () => {
  let component: MappoolBracketComponent;
  let fixture: ComponentFixture<MappoolBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappoolBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappoolBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
