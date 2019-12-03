import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorHeaderComponent } from './administrator-header.component';

describe('AdministratorHeaderComponent', () => {
  let component: AdministratorHeaderComponent;
  let fixture: ComponentFixture<AdministratorHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
