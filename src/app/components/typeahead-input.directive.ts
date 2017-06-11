import {
  AfterViewInit, ChangeDetectorRef, Directive, ElementRef, forwardRef, HostBinding, HostListener,
  Input
} from '@angular/core';
import { TypeaheadComponent } from './typeahead.component';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '../lib/keycodes';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import { TypeaheadOptionComponent } from './typeahead-option.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appTypeahead]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadInputDirective),
      multi: true
    }
  ]
})
export class TypeaheadInputDirective implements AfterViewInit, ControlValueAccessor {
  @HostBinding('attr.autocomplete') _a = 'off';

  /** View -> model callback called when value changes */
  _onChange: (value: any) => void = () => {
  };

  /** View -> model callback called when autocomplete has been touched */
  _onTouched = () => {
  };

  @Input('appTypeahead') typeahead: TypeaheadComponent;

  constructor(private element: ElementRef) {
  }

  @HostListener('focus') onFocus() {
    this.openPanel();
  }

  @HostListener('blur') onBlur() {
    this.typeahead.showPanel = false;
  }

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE && this.typeahead.showPanel) {
      this.typeahead.showPanel = false;
    } else if (this.typeahead.showPanel && this.typeahead.selectedOption && event.keyCode === ENTER) {
      this.typeahead.selectedOption.select();
      event.preventDefault();
    } else if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
      if (event.keyCode === DOWN_ARROW) {
        this.typeahead.selectNext();
      } else {
        this.typeahead.selectPrev();
      }
      event.preventDefault();

    }
  }

  private openPanel() {
    this.typeahead.showPanel = true;
    console.log('open');

    this.typeahead.options.changes
      .switchMap((optionList) => Observable.merge(...optionList.map((option) => option.onSelectionChange)))
      .first()
      .subscribe(
        (selectedElement: any) => {
          console.log('selected element:', selectedElement);
          this.setValueAndClose(selectedElement);
        },
        (err) => console.error('um wtf?', err)
      );
  }

  writeValue(value: string): void {
    console.log('writeValue called');
    Promise.resolve(null).then(() => this.setTriggerValue(value));
  }

  setTriggerValue(value) {
    this.element.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // ????
    console.log('setDisabledState not implemented!!');
    throw new Error('Method not implemented.');
  }

  private setValueAndClose(selected: TypeaheadOptionComponent) {
    const value = selected.value;
    console.log('ok, setting the thing');
    this._onChange(value);
    this.setTriggerValue(value);
    this.typeahead.showPanel = false;

  }

  ngAfterViewInit(): void {
    const {bottom, left, width} = this.element.nativeElement.getBoundingClientRect();
    this.typeahead.setPosition({bottom, left, width});
  }
}
