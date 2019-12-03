import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorNavigationComponent } from './administrator-navigation.component';

describe('AdministratorNavigationComponent', () => {
  let component: AdministratorNavigationComponent;
  let fixture: ComponentFixture<AdministratorNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
