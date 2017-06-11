import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-typeahead-option',
  template: `
    <ng-content></ng-content>`,
  styles: [`
    :host {
      cursor: pointer;
      min-height: 30px;
      display: flex;
      width: 100%;
      align-items: center;
      border-bottom: 1px solid white;
    }

    :host:last-of-type {
      border-bottom: none;
    }

    :host.app-selected {
      background: darkblue;
      color: white;
    }`]
})
export class TypeaheadOptionComponent {

  @HostBinding('class.app-typeahead-option') _classAppTypeaheadOption = true;
  @HostBinding('class.app-selected') selected = false;
  @Input() value: any;
  @Output() onSelectionChange = new EventEmitter<TypeaheadOptionComponent>();

  public select() {
    this.onSelectionChange.emit(this);
  }

  @HostListener('mousedown') onClick() {
    this.select();
  }
}
