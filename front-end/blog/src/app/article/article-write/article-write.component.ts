/** Native Modules */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

/** Services */
import { ArticleService } from 'src/app/services/ajax/article.service';
import { UploadService } from 'src/app/services/ajax/upload.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';
import { AuthService } from 'src/app/services/ajax/auth.service';
import { CategoryService } from 'src/app/services/util/category.service';

/** Custom Modules */
import { unknownErrorContext, getHttpErrorContext, DuplicationError } from 'src/app/helpers/error.helper';
import { UtilHelper } from 'src/app/helpers/util.helper';

/** Variables */
import { contentCSS } from '../@variables';

/** Font Awesome */
import { faTrash, faMask } from '@fortawesome/free-solid-svg-icons';

/** Types */
import { Article, HeadProperties } from 'src/app/services/@types';


@Component({
  selector: 'blog-article-write',
  templateUrl: './article-write.component.html',
  styles: [ contentCSS ],
  styleUrls: ['./article-write.component.scss']
})
export class ArticleWriteComponent implements OnInit, OnDestroy {

  public readonly editorConfig: Record<string, any> = {
    apiKey: 'wt58iyw7noiy32staz2yb23iqr3mkny2qwf9w45spnumtc7l',
    plugins: 'code image media link table',
    toolbar: [
      'undo redo | bold italic underline strikethrough blockquote | forecolor backcolor | link media image | removeformat code',
      'styleselect fontsizeselect | alignjustify alignleft aligncenter alignright | indent outdent'
    ],
    height: 500,
    resize: false,
    font_formats: 'Nanum Barun Gothic=Nanum Barun Gothic, Ubuntu, sans-serif;',
    fontsize_formats: '8px 9px 10px 12px 14px 16px 18px 24px 36px 48px',
    style_formats: [
      { title: 'Thumbnail Image', classes: 'thumbnail-image', block: 'div' },
      { title: 'Subtitle', classes: 'article-subtitle', block: 'h3' },
      { title: 'Responsive Embed', classes: 'responsive-embed', block: 'div' }
    ],
    menubar: 'format insert table',
    body_class: 'article-content-container',
    content_style: contentCSS,
    images_upload_handler: (blobInfo, resolve, reject) => this.imageUploadHandler(blobInfo, resolve, reject)
  }
  public readonly headProperties: HeadProperties = {
    meta: {
      'og:title': 'Post - Slacking studio x BLOG'
    },
    title: 'Post'
  }

  @ViewChild('categoryInput', { static: false }) categoryInputElRef: ElementRef;
  @ViewChild('confirmTemplate', { static: false }) confirmTemplateRef: TemplateRef<any>;

  public formGroup: FormGroup = new FormGroup({
    title: new FormControl('', [ Validators.required, Validators.pattern(/^[^-]+$/) ]),
    editorContent: new FormControl('', [ Validators.required ]),
    category: new FormControl('', [ Validators.required ])
  });
  public status: boolean = false;
  public images: Array<string> = []
  public tags: Array<string> = []

  public readonly trashIcon = faTrash;
  public readonly maskIcon = faMask;
  public categoryFocus: boolean = false;
  public categoryList: Array<{ name: string; selected: boolean; }>;
  public tag: string;
  public modify: boolean = false;
  private previousArticle: Article;

  private categorySubscription: Subscription;
  public dismissConfirm: () => void;

  constructor(
    private auth: AuthService,
    private article: ArticleService,
    private upload: UploadService,
    private stickyBar: StickyBarService,
    private category: CategoryService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.setBehavior();
    this.subscribeCategoryList();
  }

  ngOnDestroy() {
    UtilHelper.unsubscribeAll(this.categorySubscription);
    if (this.dismissConfirm) this.dismissConfirm();
  }

  public async write(): Promise<void> {
    if (!this.writable) return;

    try {
      const { title, editorContent, category } = this.formGroup.controls;

      const article: Article = {
        title: this.article.encodeTitle(title.value),
        category: category.value,
        content: editorContent.value,
        author: this.auth.currentUser._id,
        status: this.status,
        tags: this.tags,
        images: this.images
      }

      await this.article.writeArticle(article);

      this.stickyBar.open('Posted.');
      if (this.status || this.auth.admin) {
        this.category.add(category.value);
        this.router.navigate([article.category, article.title]);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(): Promise<void> {
    if (!this.writable) return;

    try {
      const { title, editorContent, category } = this.formGroup.controls;

      const updateForm: Article = {
        title: this.article.encodeTitle(title.value),
        category: category.value,
        content: editorContent.value,
        status: this.status,
        tags: this.tags,
        images: this.images,
      }

      for (const key of ['title', 'category', 'content', 'status'])
        if (updateForm[key] === this.previousArticle[key]) delete updateForm[key];

      await this.article.updateArticle(this.previousArticle.title, updateForm);

      this.stickyBar.open('Updated.');
      if (this.status || this.auth.admin) {
        this.category.add(category.value);
        this.router.navigate([category.value, this.article.encodeTitle(title.value)]);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  public async delete(): Promise<void> {
    this.dismissConfirm();

    try {
      await this.article.deleteArticle(this.previousArticle.title);

      this.stickyBar.open('Deleted');
    } catch (error) {
      this.stickyBar.open(error instanceof HttpErrorResponse ? getHttpErrorContext(error.status) : unknownErrorContext);
    }
  }

  public validator(controlKey: string): boolean {
    const control = this.formGroup.get(controlKey);
    if (!control) return true;

    return control.dirty && control.invalid;
  }

  public get writable(): boolean {
    return this.formGroup.valid;
  }

  public toggleStatus(): void {
    this.status = !this.status;
  }

  public toggleCategoryFocus(event: FocusEvent): void {
    switch (event.type) {
      case 'focus':
        this.categoryFocus = true;
        break;
      case 'blur':
        const remove = this.renderer.listen(window, 'pointerup', () => {
          window.setTimeout(() => this.categoryFocus = false);

          remove();
        });
        break;
    }
  }

  public selectCategory(event: KeyboardEvent): void {
    const
    input = event.key.toLowerCase(),
    key = ['down', 'up', 'enter'].find(key => input.includes(key));

    if (!key) return;

    event.preventDefault();

    switch (key) {
      case 'down':
        this.navigateCategoryList(+1);
        break;
      case 'up':
        this.navigateCategoryList(-1);
        break;
      case 'enter':
        this.setCategory();
        break;
    }
  }

  public addTag(event: Event): void {
    event.preventDefault();

    if (this.tag && !this.tags.includes(this.tag)) {
      this.tags.push(this.tag);
      this.tag = '';
    }
  }

  public removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) this.tags.splice(index, 1);
  }

  public setCategory(category?: string): void {
    const selectedCategory = this.categoryList.find(c => c.selected);

    if (!category) category = selectedCategory && selectedCategory.name;
    if (selectedCategory) selectedCategory.selected = false;
    else return;

    this.formGroup.get('category').setValue(category);
    this.categoryFocus = false;
  }
  
  public blurPolyfill(event: KeyboardEvent): void {
    if (event.key && event.key.toLowerCase().includes('tab')) this.categoryFocus = false;
  }

  public async deleteImage(path: string, event: MouseEvent): Promise<void> {
    if (event) event.stopPropagation();

    try {
      await this.upload.deleteImage(path);

      this.deleteImageFromEditor(path);
      this.images.splice(this.images.indexOf(path), 1);
    } catch (error) {
      let message: string = unknownErrorContext;

      if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);

      this.stickyBar.open(message);
    }
  }

  public copy(location: string): void {
    const el = this.renderer.createElement('input') as HTMLInputElement;
    this.renderer.setProperty(el, 'value', location);

    this.renderer.setStyle(el, 'position', 'fixed');
    this.renderer.setStyle(el, 'top', '-100px');

    this.renderer.appendChild(document.body, el);

    el.select();
    document.execCommand('copy', false);

    this.stickyBar.open('Copy image address');
    this.renderer.removeChild(document.body, el);
  }

  public confirmDelete(): void {
    if (!this.dismissConfirm) {
      const id = this.stickyBar.open(this.confirmTemplateRef, { duration: void(0) });

      this.dismissConfirm = () => {
        this.stickyBar.dismiss(id, true);
        this.dismissConfirm = void(0);
      }
    }
  }

  private deleteImageFromEditor(location: string): void {
    const
    control = this.formGroup.get('editorContent'),
    containerEl = this.renderer.createElement('div') as HTMLElement;

    this.renderer.setProperty(containerEl, 'innerHTML', control.value);

    const imgEl = containerEl.querySelector(`img[src="${ location }"]`);
    if (imgEl) {
      imgEl.parentElement.removeChild(imgEl);

      control.setValue(containerEl.innerHTML);
    }
  }

  private async imageUploadHandler(blobInfo, resolve, reject): Promise<void> {
    try {
      const { location } = await this.upload.uploadImage(blobInfo.blob());

      this.images.push(location);
      resolve(location);
    } catch (error) {
      reject(error);
    }
  }

  private subscribeCategoryList(): void {
    this.categorySubscription = this.category.categoryList.subscribe(list => this.categoryList = list.map(name => ({ name, selected: false })));
  }

  private navigateCategoryList(direction: number): void {
    const currentItem = this.categoryList.find(item => item.selected);

    if (currentItem) {
      let index = this.categoryList.indexOf(currentItem) + direction;
      if (index < 0) index = this.categoryList.length - 1;
      if (index >= this.categoryList.length) index = 0;

      const targetItem = this.categoryList[index];

      if (currentItem !== targetItem) {
        currentItem.selected = false;
        targetItem.selected = true;
      }
    } else if (this.categoryList[0]) this.categoryList[0].selected = true;
  }

  private async setBehavior(): Promise<void> {
    const encodedTitle = this.route.snapshot.paramMap.get('title');

    if (encodedTitle) {
      this.modify = true;

      let article: Article;
      try {
        article = await this.article.getArticle(encodedTitle);
      } catch (error) {
        let message: string = unknownErrorContext;

        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) message = `Fail to find article "${ this.article.decodeTitle(encodedTitle) }" doesn't exist`;
          else message = getHttpErrorContext(error.status);
        }

        this.stickyBar.open(message);
        this.router.navigateByUrl('/');
        return;
      }

      const { title, editorContent, category } = this.formGroup.controls;

      title.setValue(this.article.decodeTitle(article.title));
      editorContent.setValue(this.imagePathToAbsolute(article.content));
      category.setValue(article.category);

      this.images = article.images || []
      this.tags = article.tags || []
      this.status = article.status;

      this.previousArticle = article;
    }
  }

  private handleError(error: any): void {
    let message: string = unknownErrorContext;

    if (error instanceof HttpErrorResponse) message = getHttpErrorContext(error.status);
    else if (error instanceof DuplicationError) message = error.message;

    this.stickyBar.open(message);
  }

  private imagePathToAbsolute(html: string): string {
    const el = this.renderer.createElement('div');
    el.innerHTML = html;

    for (const imgEl of Array.from(el.querySelectorAll('img') as Array<HTMLImageElement>)) {
      const src = imgEl.getAttribute('src');
      if (src) {
        if (src.indexOf('/') === 0) src.replace('/', '');
        if (!src.includes('http')) this.renderer.setAttribute(imgEl, 'src', `https://${ window.location.hostname }/${ src }`);
      }
    }

    return el.innerHTML;
  }

}
