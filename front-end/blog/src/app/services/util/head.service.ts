/** Native Modules */
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/** Types */
import { HeadProperties } from '../@types';

/** Custom Modules */
import { UtilHelper } from 'src/app/helpers/util.helper';


@Injectable({
  providedIn: 'root'
})
export class HeadService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  public async onActivate(event: any): Promise<void> {
    this.updateHeadProperties(event.headProperties instanceof Promise ? await event.headProperties : event.headProperties);
  }

  public updateHeadProperties(properteis: HeadProperties = {}): void {
    let { meta, title } = properteis;

    meta = UtilHelper.assign(meta || {}, {
      'og:title': 'Slacking studio x BLOG',
      'og:type': 'website',
      'og:description': 'Slacking studio blog.',
      'og:image': 'https://blog.eunsatio.io/assets/images/default-thumbnail.png'
    });

    for (const key in meta) this.meta.updateTag({ property: key, content: meta[key] });
    this.title.setTitle(title ? `${ title } - Slacking studio BLOG` : 'Slacking studio BLOG');
  }

}
