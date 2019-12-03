import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleWriteComponent } from './article-write.component';

describe('ArticleWriteComponent', () => {
  let component: ArticleWriteComponent;
  let fixture: ComponentFixture<ArticleWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
