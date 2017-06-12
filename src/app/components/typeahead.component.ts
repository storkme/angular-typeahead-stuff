import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit, Component, ContentChildren, ElementRef, Input, OnInit, QueryList,
  ViewChild
} from '@angular/core';
import { some, take } from 'lodash';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { TypeaheadOptionComponent } from './typeahead-option.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-typeahead',
  template: `
    <div class="app-typeahead-panel" #panel [@panelState]="getPanelState()">
      <ng-content></ng-content>
    </div>`,
  styles: [`
    .app-typeahead-panel {
      position: fixed;
      z-index: 5;
      background: #f8f8f8;
      border: 1px solid c8c8c8;
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
    }`],
  animations: [
    trigger('panelState', [
      state('hidden', style({
        visibility: 'hidden',
        opacity: 0
      })),
      state('visible', style({
        visibility: 'visible',
        opacity: 1
      })),
      transition('hidden => visible', animate('100ms ease-in')),
      transition('visible => hidden', animate('100ms ease-out'))
    ])
  ]
})
export class TypeaheadComponent implements AfterViewInit {
  @ContentChildren(TypeaheadOptionComponent) options: QueryList<TypeaheadOptionComponent>;
  @ViewChild('panel') panel: ElementRef;
  showPanel = false;
  selectedOptionIndex = -1;
  optionArray: TypeaheadOptionComponent[];
  selectedOption: TypeaheadOptionComponent;

  constructor() {
  }

  public selectNext(i = 1) {
    this.setCurrentItem(false);
    this.selectedOptionIndex = Math.min(Math.max(this.selectedOptionIndex + i, 0), this.optionArray.length - 1);
    this.setCurrentItem(true);
  }

  public reset() {
    this.setCurrentItem(false);
    this.selectedOption = null;
    this.selectedOptionIndex = -1;
  }

  setCurrentItem(selected: boolean) {
    if (this.optionArray && this.optionArray[this.selectedOptionIndex]) {
      this.selectedOption = this.optionArray[this.selectedOptionIndex];
      this.selectedOption.selected = selected;
      if (selected) {
        const windowTop = this.panel.nativeElement.scrollTop;
        const windowBottom = windowTop + this.panel.nativeElement.getBoundingClientRect().height;
        const elementTop = this.selectedOption.offsetTop;
        const elementBottom = elementTop + this.selectedOption.elementHeight;
        let scroll = 0;

        if (elementTop < windowTop) {
          scroll = elementTop - windowTop;
        } else if (elementBottom > windowBottom) {
          scroll = elementBottom - windowBottom;
        }

        if (scroll) {
          this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollTop + scroll;
        }
      }
    }
  }

  getPanelState() {
    return this.showPanel ? 'visible' : 'hidden';
  }

  ngAfterViewInit() {
    // get a list of our app-typeahead-option child elements
    this.options.changes
      .subscribe((queryList) => {
        this.selectedOptionIndex = -1;
        this.optionArray = queryList.toArray();
      });
  }

  setPosition({bottom, left, width}: { bottom: number; left: number; width: number }) {
    this.panel.nativeElement.style.top = `${bottom}px`;
    this.panel.nativeElement.style.left = `${left}px`;
    this.panel.nativeElement.style.width = `${width}px`;
  }

  scroll(scroll: number) {
    this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollTop + scroll;
  }
}
