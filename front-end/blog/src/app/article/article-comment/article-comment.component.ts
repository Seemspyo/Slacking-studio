/** Native Modules */
import { Component, OnInit, Input, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';
import { CommentService } from 'src/app/services/ajax/comment.service';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';
import { unknownErrorContext, getHttpErrorContext } from 'src/app/helpers/error.helper';

/** Types */
import { RenderableComment } from '../@types';
import { ArticleComment } from 'src/app/services/@types';


@Component({
  selector: 'blog-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss']
})
export class ArticleCommentComponent implements OnInit, OnDestroy {

  @Input('comments') commentIdList: Array<string>;
  @Input() articleId: string;

  @ViewChild('ConfirmPassword') confirmRef: TemplateRef<any>;

  public commentList: Array<RenderableComment>;

  private commentGroupMap: Map<string | number, FormGroup> = new Map();
  private editGroupMap: Map<string, FormGroup> = new Map();
  private confirmMap: Map<string, () => void> = new Map();

  public sign: boolean = false;
  public processing: boolean = false;

  private date: DatePipe = new DatePipe('en_US');
  private authEventSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private comment: CommentService,
    private sticky: StickyBarService
  ) { }

  ngOnInit() {
    this.sign = this.auth.sign;
    this.subscribeSignEvent();
    this.loadCommentList();
  }

  ngOnDestroy() {
    UtilHelper.unsubscribeAll(this.authEventSubscription);
  }

  public getTemplateContext(id: string | number): { formGroup: FormGroup } {
    const
    map = this.commentGroupMap,
    isChild = typeof id === 'string';
    let formGroup: FormGroup;

    if (map.has(id)) formGroup = map.get(id);
    else {
      const getValue = (key: string): string => {
        if (isChild && key === 'parentId') return id as string;
        return void(0);
      }

      formGroup = this.getGroup(getValue);
      map.set(id, formGroup);
    }

    return { formGroup }
  }

  public getEditGroup(id: string): FormGroup {
    const map = this.editGroupMap;

    if (map.has(id)) return map.get(id);
  }

  public get userProfileImagePath(): string {
    return (this.auth.sign && this.auth.currentUser.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

  public toggleReplyMode(comment: RenderableComment): void {
    comment.replyMode = !comment.replyMode;

    switch (comment.replyMode) {
      case true:
        const getValue = (key: string) => {
          if (key === 'parentId') return comment.id;
          return void(0);
        }

        this.commentGroupMap.set(comment.id, this.getGroup(getValue));
        break;
      case false:
        this.commentGroupMap.delete(comment.id);
        break;
    }
  }

  public toggleEditMode(comment: RenderableComment): void {
    comment.editMode = !comment.editMode;

    switch (comment.editMode) {
      case true:
        const
        filter = ['id', 'parentId', 'content'],
        getValue = (key: string) => {
          if (filter.includes(key)) return comment[key];
          return void(0);
        }

        this.editGroupMap.set(comment.id, this.getGroup(getValue, false));
        break;
      case false:
        this.editGroupMap.delete(comment.id);
        break;
    }
  }

  public managable(comment: RenderableComment): boolean {
    switch (comment.type) {
      case 'user':
        const auth = this.auth;

        return (auth.sign && (auth.currentUser.level >= 8 || auth.currentUser._id == comment.authorId));
      case 'guest':
        return true;
    }
  }

  public confirm(command: 'edit' | 'delete', comment: RenderableComment): void {
    event.preventDefault();

    if (this.auth.sign && this.auth.currentUser.level >= 8 && window.confirm('Sure?')) this[command](comment);
    else {
      if (this.confirmMap.has(comment.id)) this.dismissConfirm(comment.id);
      const windowId = this.sticky.open(this.confirmRef, { duration: void(0), context: { comment: comment, command } });

      this.confirmMap.set(comment.id, () => this.sticky.dismiss(windowId, true));
    }
  }

  public onConfirmSubmit(event: Event, comment: RenderableComment, command: 'edit' | 'delete'): void {
    if (event) event.preventDefault();

    switch (command) {
      case 'edit':
        this.edit(comment);
        break;
      case 'delete':
        this.delete(comment);
        break;
    }
  }

  public async postComment(event: Event, formGroup: FormGroup): Promise<void> {
    event.preventDefault();
    if (formGroup.invalid || this.processing) return;

    this.processing = true;

    let comment: ArticleComment = {
      article: this.articleId,
      content: formGroup.value.content,
      parent: formGroup.value.parentId
    }

    if (!this.auth.sign) comment = {
      ...comment,
      nickname: formGroup.value.nickname,
      password: formGroup.value.password
    }
    else comment = {
      ...comment,
      author: this.auth.currentUser._id
    }

    try {
      comment = await this.comment.writeComment(comment);

      if (comment.parent) {
        const parent = this.commentList.find(item => item.id == comment.parent);

        this.insert(this.toRenderable(comment), parent);
        parent.replyMode = false;
      }
      else this.commentList.push(this.toRenderable(comment));

      formGroup.reset();
    } catch (error) {
      this.sticky.open('Error has occurred.\nPlease try later.');
    }

    this.processing = false;
  }

  public dismissConfirm(id: string): void {
    if (this.confirmMap.has(id)) {
      this.confirmMap.get(id)();
      this.confirmMap.delete(id);
    }
  }

  public validator(control: FormControl): boolean {
    if (!control) return true;

    return control.dirty && control.invalid;
  }

  public getNickname(id: string): string {
    const item = this.commentList.find(item => item.id == id);

    return (item && item.nickname) || 'Anonymous';
  }

  private async loadCommentList(): Promise<void> {
    this.processing = true;

    try {
      const comments = this.sortByTree(await this.comment.getCommentAll(this.articleId));

      this.commentList = this.toRenderableAll(comments);
    } catch (error) {
      this.sticky.open('Fail to load comments.\nPlease retry later.');
    }

    this.processing = false;
  }

  private toRenderable(comment: ArticleComment): RenderableComment {
    const isAuthorUser = Boolean(comment.author);

    return {
      id: comment._id,
      authorId: isAuthorUser && comment.author._id,
      parentId: comment.parent,
      content: comment.content,
      nickname: isAuthorUser ? comment.author.nickname : comment.nickname,
      profileImagePath: (isAuthorUser && comment.author.profileImagePath) || AuthService.DEFAULT_PROFILE_IMAGE_PATH,
      editMode: false,
      replyMode: false,
      dateString: this.toDateString(comment.date),
      type: isAuthorUser ? 'user' : 'guest',
      deleted: comment.deleted
    }
  }

  private toRenderableAll(comments: Array<ArticleComment>): Array<RenderableComment> {
    const renderables = comments.map(comment => this.toRenderable(comment));

    return renderables;
  }

  private sortByTree(comments: Array<ArticleComment>): Array<ArticleComment> {
    const tree: Array<[ ArticleComment, Array<ArticleComment> ]> = new Array();

    comments = [ ...comments ].sort((a, b) => new Date(a.date.createdAt).getTime() - new Date(b.date.createdAt).getTime());

    for (const comment of comments) {
      switch (Boolean(comment.parent)) {
        case true:
          const milestone = tree.find(([parent, children]) => parent._id == comment.parent || children.find(child => child._id == comment.parent));

          if (milestone) milestone[1].push(comment);
          break;
        case false:
          tree.push([ comment, new Array() ]);
          break;
      }
    }

    return [].concat(...tree.map(([parent, children]) => [parent].concat(children)));
  }

  private toDateString(dates: ArticleComment["date"]): string {
    const
    createdAt = new Date(dates.createdAt),
    updatedAt = new Date(dates.lastUpdatedAt);

    let
    prefix: string,
    date: Date;

    if (createdAt.getTime() === updatedAt.getTime()) {
      prefix = 'Posted';
      date = createdAt;
    } else {
      prefix = 'Updated';
      date = updatedAt;
    }

    return `${ prefix } · ${ this.date.transform(date, 'MMM d, yyyy H:mm') }`;
  }

  private getGroup(getValue: (key: string) => any = () => void(0), validate: boolean = true): FormGroup {
    let controls: { [key: string]: FormControl } = {
      id: new FormControl(getValue('id') || Date.now().toString(16)),
      content: new FormControl(getValue('content'), [ Validators.required, Validators.minLength(4), Validators.maxLength(1000) ]),
      parentId: new FormControl(getValue('parentId'))
    }

    if (!this.sign) controls = {
      ...controls,
      nickname: new FormControl(getValue('nickname'), validate ? [ Validators.required, Validators.minLength(2), Validators.maxLength(20) ] : void(0)),
      password: new FormControl(getValue('password'), validate ? [ Validators.required, Validators.minLength(4), Validators.maxLength(24) ] : void(0))
    }

    return new FormGroup(controls);
  }

  private updateControls(): void {
    if (this.auth.sign !== this.sign) {
      this.sign = this.auth.sign;

      const getValue = (group: FormGroup) => {
        return (key: string) => {
          const control = group.controls[key];

          return control && control.value;
        }
      }

      for (const [key, prevGroup] of this.commentGroupMap) this.commentGroupMap.set(key, this.getGroup(getValue(prevGroup)));
      for (const [key, prevGroup] of this.editGroupMap) this.editGroupMap.set(key, this.getGroup(getValue(prevGroup)));
    }
  }

  private async edit(comment: RenderableComment): Promise<void> {
    if (event) event.preventDefault();
    if (!this.editGroupMap.has(comment.id) || this.processing) return;

    this.processing = true;

    const
    group = this.editGroupMap.get(comment.id),
    updateDoc: ArticleComment = {
      content: group.value.content,
      password: comment.password
    }

    try {
      const newComment = await this.comment.updateComment(comment.id, updateDoc);

      this.replace(this.toRenderable(newComment), comment);
      this.dismissConfirm(comment.id);
    } catch (error) {
      this.handleUpdateError(error);
    }

    this.processing = false;
  }

  private async delete(comment: RenderableComment): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    try {
      const deletedComment = await this.comment.updateComment(comment.id, { password: comment.password, deleted: true });

      this.replace(this.toRenderable(deletedComment), comment);
      this.dismissConfirm(comment.id);
    } catch (error) {
      this.handleUpdateError(error);
    }

    this.processing = false;
  }

  private handleUpdateError(error: any): void {
    let message: string = unknownErrorContext;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) message = 'Incorrect password.';
      else message = getHttpErrorContext(error.status);
    }

    this.sticky.open(message);
  }

  private subscribeSignEvent(): void {
    this.authEventSubscription = this.auth.events.subscribe(() => this.updateControls());
  }

  private replace(newDoc: RenderableComment, oldDoc: RenderableComment): void {
    this.commentList.splice(this.commentList.indexOf(oldDoc), 1, newDoc);
  }

  private insert(comment: RenderableComment, milestone: number | RenderableComment): void {
    const milestoneIndex = typeof milestone === 'number' ? milestone : this.commentList.indexOf(milestone);

    let nextParentIndex = this.commentList
      .slice(milestoneIndex + 1, this.commentList.length)
      .findIndex(comment => !comment.parentId);

    if (nextParentIndex < 0) nextParentIndex = this.commentList.length;
    else nextParentIndex += milestoneIndex + 1;

    this.commentList.splice(nextParentIndex, 0, comment);
  }

  private listenScrollEvent

}
