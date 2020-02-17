/** Native Modules */
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/** Types */
import { User } from 'src/app/services/@types';
import { FormItem } from 'src/app/account/@types';

/** Font Awesome */
import { IconDefinition, faAngleUp, faAngleDown, faUserEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import { StickyBarService } from 'src/app/services/util/sticky-bar.service';

/** Services */
import { UserService } from 'src/app/services/ajax/user.service';

/** Custom Modules */
import { FileInputDirective } from 'src/app/modules/input/file-input.directive';


@Component({
  selector: 'blog-administrator-user',
  templateUrl: './administrator-user.component.html',
  styleUrls: ['./administrator-user.component.scss']
})
export class AdministratorUserComponent implements OnInit, OnDestroy {

  public readonly headerList = [
    { key: 'nickname', label: 'Nickname' },
    { key: 'email', label: 'E-mail' },
    { key: 'level', label: 'Level' },
    { key: 'date.joinedAt', label: 'Join' },
    { key: 'date.lastLoginAt', label: 'Last login' }
  ]
  public userList: Array<User>;

  @ViewChild(FileInputDirective) profileImageInputRef: FileInputDirective;
  @ViewChild('UserForm') userFormTemplateRef: TemplateRef<any>;

  public userFormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.minLength(6) ]),
    nickname: new FormControl('', [ Validators.required ]),
    level: new FormControl('', [ Validators.required, Validators.min(0), Validators.max(10) ]),
    introduction: new FormControl('')
  });
  public forms: Array<FormItem> = [
    { id: 'email', title: 'Email', type: 'text', controlKey: 'email' },
    { id: 'password', title: 'Password', type: 'password', controlKey: 'password' },
    { id: 'nickname', title: 'Nickname', type: 'text', controlKey: 'nickname' },
    { id: 'level', title: 'Level', type: 'text', controlKey: 'level' }
  ]
  private userInfo: User;
  private newProfileImage: File;
  private dialogRef: MatDialogRef<any>;

  private prevKey: string;
  private descending: boolean = true;

  public readonly modifyIcon = faUserEdit;
  public readonly deleteIcon = faBan;

  private date: DatePipe = new DatePipe('en_US');

  constructor(
    private user: UserService,
    private sticky: StickyBarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.setUserList();
  }

  ngOnDestroy() {
    if (this.dialogRef) this.dialogRef.close();
  }

  public sortBy(key: string): void {
    if (this.isCurrentKey(key)) {
      this.descending = !this.descending;
    } else {
      this.prevKey = key;
      this.descending = true;
    }

    const direction = this.descending ? -1 : +1;

    let transform: (value: any) => any;

    switch (key) {
      case 'date.joinedAt':
        transform = value => new Date(value.joinedAt).getTime();
        break;
      case 'date.lastLoginAt':
        transform = value => new Date(value.lastLoginAt).getTime();
        break;
      default:
        transform = value => value;
    }

    this.userList.sort((a, b) => {
      const
      _key = key.split('.')[0],
      valueA = transform(a[_key]),
      valueB = transform(b[_key]);

      if (valueA < valueB) return -1 * direction;
      if (valueB < valueA) return +1 * direction;
      return 0;
    });
  }

  public isCurrentKey(key: string): boolean {
    return this.prevKey === key;
  }

  public get arrowIcon(): IconDefinition {
    return this.descending ? faAngleDown : faAngleUp;
  }

  public getDateString(date: Date): string {
    if (!date) return '';
    if (!(date instanceof Date)) date = new Date(date);

    return this.date.transform(date, 'MMM d, y HH:mm:ss');
  }

  public async deleteUser(user: User): Promise<void> {
    if (confirm(`Delete account "${ user.nickname }".\nAre you sure to proceed?`)) {
      try {
        await this.user.deleteUser(user.email);
        
        this.sticky.open('Success.');
        this.setUserList();
      } catch (error) {
        this.sticky.open('An error occurred.');
        console.error(error);
      }
    }
  }

  public async spawnUserForm(user: User): Promise<void> {
    const group = this.userFormGroup;

    group.get('email').disable();
    this.userInfo = user;

    this.dialogRef = this.dialog.open(this.userFormTemplateRef);
    await this.dialogRef.afterOpened().toPromise();

    for (const key in group.controls) if (group.controls[key]) group.controls[key].setValue(this.userInfo[key]);
    if (this.userInfo.profileImageFileName) this.profileImageInputRef.setValue(this.userInfo.profileImageFileName);
  }

  public onProfileImageSelect(): void {
    const inputEl = this.profileImageInputRef.nativeElement as HTMLInputElement;

    this.newProfileImage = inputEl.files && inputEl.files[0];
  }

  public defaultValidator(controlKey: string): boolean {
    const control = this.userFormGroup.get(controlKey);
    if (!control) return true;

    return control.dirty && control.invalid;
  }

  public async editUserInfo(event: Event): Promise<void> {
    event.preventDefault();

    const
    controls = this.userFormGroup.controls,
    updateForm: User = new Object();
    
    if (this.newProfileImage) {
      updateForm.profileImage = this.newProfileImage;
      updateForm.profileImageFileName = this.newProfileImage.name;
    }

    for (const key of ['password', 'nickname', 'level', 'introduction']) {
      const value = controls[key].value;

      if (value) updateForm[key] = value;
    }

    try {
      await this.user.updateUser(this.userInfo.email, updateForm);
      this.sticky.open('Updated.');
      this.dialogRef.close();

      this.setUserList();
    } catch (error) {
      this.sticky.open('An error occurred.');
      console.error(error);
    }
  }

  private async setUserList(): Promise<void> {
    try {
      this.userList = await this.user.getUserAll();
    } catch (error) {
      this.sticky.open('An error occurred.');
      console.error(error);
    }
  }

}
