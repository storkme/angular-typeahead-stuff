import {
  Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input,
  Output
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TypeaheadComponent } from './typeahead.component';

@Component({
  selector: 'app-typeahead-option',
  template: `
    <ng-content></ng-content>`,
  styles: [`
    :host {
      cursor: pointer;
      min-height: 48px;
      display: flex;
      width: 100%;
      align-items: center;
      border-bottom: 1px solid white;
      transition: all 0.1s ease-in-out;
      font-size: 24px;
      padding: 0 5px;
    }

    :host:last-of-type {
      border-bottom: none;
    }

    :host.app-selected {
      background: darkblue;
      color: white;
    }

    :host:hover {
      background: lightblue;
    }`],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition(':enter', [
        style({transform: 'translateX(-20%)'}),
        animate(100)
      ]),
      transition(':leave', [
        animate(100, style({transform: 'translateX(20%)'}))
      ])
    ])
  ]
})
export class TypeaheadOptionComponent {

  @HostBinding('class.app-typeahead-option') _classAppTypeaheadOption = true;
  @HostBinding('class.app-selected') selected = false;
  @HostBinding('@flyInOut') flyInOut;
  @Input() value: any;
  @Output() onSelectionChange = new EventEmitter<TypeaheadOptionComponent>();

  constructor(private element: ElementRef,
              @Inject(forwardRef(() => TypeaheadComponent)) private typeahead: TypeaheadComponent) {
  }

  public get offsetTop() {
    return this.element.nativeElement.offsetTop;
  }


  public get elementHeight() {
    return this.element.nativeElement.getBoundingClientRect().height;
  }

  public select() {
    this.onSelectionChange.emit(this);
  }

  @HostListener('mousedown', ['$event']) onClick(event: MouseEvent) {
    if (event.button === 0) {

      console.log('selecting...');
      this.select();
    }
  }
}
