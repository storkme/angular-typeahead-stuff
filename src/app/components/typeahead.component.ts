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
      background: #d8d8d8;
      border: 1px solid grey;
      max-height: 300px;
      overflow-y: scroll;
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

  public selectNext() {
    this.setCurrentItem(false);
    this.selectedOptionIndex = Math.min(this.selectedOptionIndex + 1, this.optionArray.length - 1);
    this.setCurrentItem(true);
  }

  public selectPrev() {
    this.setCurrentItem(false);
    this.selectedOptionIndex = Math.max(this.selectedOptionIndex - 1, 0);
    this.setCurrentItem(true);
  }

  setCurrentItem(selected: boolean) {
    if (this.optionArray && this.optionArray[this.selectedOptionIndex]) {
      this.selectedOption = this.optionArray[this.selectedOptionIndex];
      this.selectedOption.selected = selected;
    }
  }

  getPanelState() {
    return this.showPanel ? 'visible' : 'hidden';
  }

  ngAfterViewInit() {
    // get a list of our app-typeahead-option child elements
    this.options.changes
      .subscribe((queryList) => {
        console.log('cool, new query list');
        this.selectedOptionIndex = -1;
        this.optionArray = queryList.toArray();
      });
  }

  setPosition({bottom, left, width}: { bottom: number; left: number; width: number }) {
    console.log('heyyy what up we are setting styles on panel now');
    this.panel.nativeElement.style.top = `${bottom}px`;
    this.panel.nativeElement.style.left = `${left}px`;
    this.panel.nativeElement.style.width = `${width}px`;
  }
}
