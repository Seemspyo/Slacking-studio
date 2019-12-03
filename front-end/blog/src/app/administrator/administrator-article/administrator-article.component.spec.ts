import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorArticleComponent } from './administrator-article.component';

describe('AdministratorArticleComponent', () => {
  let component: AdministratorArticleComponent;
  let fixture: ComponentFixture<AdministratorArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
