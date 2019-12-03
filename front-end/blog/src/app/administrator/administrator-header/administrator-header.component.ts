/** Native Modules */
import { Component, Output, EventEmitter } from '@angular/core';

/** Font Awesome */
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** Services */
import { AuthService } from 'src/app/services/ajax/auth.service';


@Component({
  selector: 'blog-administrator-header',
  templateUrl: './administrator-header.component.html',
  styleUrls: ['./administrator-header.component.scss']
})
export class AdministratorHeaderComponent {

  @Output('navigation-toggle') navToggleEvent: EventEmitter<void> = new EventEmitter();

  public readonly navIcon = faBars;

  constructor(
    private auth: AuthService
  ) { }

  public emitNavEvent(): void {
    this.navToggleEvent.emit();
  }

  public get userProfileImagePath(): string {
    return this.auth.currentUser && this.auth.currentUser.profileImagePath || AuthService.DEFAULT_PROFILE_IMAGE_PATH;
  }

}
