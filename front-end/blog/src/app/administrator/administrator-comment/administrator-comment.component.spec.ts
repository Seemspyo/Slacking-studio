import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorCommentComponent } from './administrator-comment.component';

describe('AdministratorCommentComponent', () => {
  let component: AdministratorCommentComponent;
  let fixture: ComponentFixture<AdministratorCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
