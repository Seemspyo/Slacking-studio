/** Native Modules */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


@Pipe({
  name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  public transform(value: string, command: 'html'|'style'|'script'|'url'|'resoureceUrl'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (command) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resoureceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new TypeError(`Fail to bypass security for invalid command: ${ command }`);
    }
  }

}
