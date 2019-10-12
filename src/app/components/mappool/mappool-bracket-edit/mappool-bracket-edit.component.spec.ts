import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolBracketEditComponent } from './mappool-bracket-edit.component';

describe('MappoolBracketEditComponent', () => {
  let component: MappoolBracketEditComponent;
  let fixture: ComponentFixture<MappoolBracketEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappoolBracketEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappoolBracketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
