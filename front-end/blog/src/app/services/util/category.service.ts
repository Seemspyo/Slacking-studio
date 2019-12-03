/** Native Modules */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public categoryList: BehaviorSubject<string[]>;
  private list: Array<string> = []

  public currentCategory: BehaviorSubject<string>;
  private category: string = 'blog';

  constructor() {
    this.categoryList = new BehaviorSubject(this.list);
    this.currentCategory = new BehaviorSubject(this.category);
  }

  public set(category: string = 'blog'): string {
    this.category = category;
    this.currentCategory.next(this.category);

    return this.category;
  }

  public add(category: string | Array<string>): void {
    if (!Array.isArray(category)) category = [ category ]

    this.list = this.list.concat(category.filter(c => !this.includes(c)));

    this.categoryList.next(this.list);
  }

  public includes(category: string): boolean {
    return this.list.includes(category);
  }

}
