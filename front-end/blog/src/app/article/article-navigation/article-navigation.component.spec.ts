import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNavigationComponent } from './article-navigation.component';

describe('ArticleNavigationComponent', () => {
  let component: ArticleNavigationComponent;
  let fixture: ComponentFixture<ArticleNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
