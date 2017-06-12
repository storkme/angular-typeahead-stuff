import { Directive, ElementRef, forwardRef, HostBinding, HostListener, Input } from '@angular/core';
import { TypeaheadComponent } from './typeahead.component';
import { DOWN_ARROW, ENTER, ESCAPE, PAGE_DOWN, PAGE_UP, UP_ARROW } from '../lib/keycodes';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/first';
import { TypeaheadOptionComponent } from './typeahead-option.component';
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  selector: 'input[appTypeahead]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadInputDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TypeaheadInputDirective),
      multi: true
    }
  ]
})
export class TypeaheadInputDirective implements ControlValueAccessor, Validator {
  @HostBinding('attr.autocomplete') _a = 'off';
  /** View -> model callback called when value changes */
  _onChange: (value: any) => void = () => {
  };

  /** View -> model callback called when autocomplete has been touched */
  _onTouched = () => {
  };

  @Input('appTypeahead') typeahead: TypeaheadComponent;
  @Input() displayWith: (any) => string;

  constructor(private element: ElementRef) {
  }

  @HostListener('focus')
  private onFocus() {
    this.openPanel();
  }

  @HostListener('blur')
  private onBlur() {
    this.typeahead.showPanel = false;
  }


  @HostListener('input', ['$event'])
  private onInput(event1) {
    this.typeahead.reset();
    this._onChange((event.target as HTMLInputElement).value);
    this.openPanel();
  }

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE && this.typeahead.showPanel) {
      this.typeahead.showPanel = false;
    } else if (this.typeahead.showPanel && this.typeahead.selectedOption && event.keyCode === ENTER) {
      this.typeahead.selectedOption.select();
      event.preventDefault();
    } else if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW || event.keyCode === PAGE_DOWN || event.keyCode === PAGE_UP) {

      this.openPanel();
      let d;
      if (event.keyCode === DOWN_ARROW) {
        d = 1;
      } else if (event.keyCode === UP_ARROW) {
        d = -1;
      } else if (event.keyCode === PAGE_DOWN) {
        d = 10;
      } else if (event.keyCode === PAGE_UP) {
        d = -10;
      }
      this.typeahead.selectNext(d);
      event.preventDefault();
    }
  }


  @HostListener('window:scroll')
  private onScroll() {
    if (this.typeahead.showPanel) {
      this.typeahead.setPosition(this.element.nativeElement.getBoundingClientRect());
    }
  }

  private openPanel() {
    this.typeahead.setPosition(this.element.nativeElement.getBoundingClientRect());
    this.typeahead.showPanel = true;

    this.typeahead.options.changes
      .startWith(this.typeahead.optionArray)
      .filter((e) => !!e)
      .switchMap((optionList) => Observable.merge(...optionList.map((option) => option.onSelectionChange)))
      .first()
      .subscribe(
        (selectedElement: any) => {
          this.setValueAndClose(selectedElement);
        }
      );
  }

  writeValue(value: string): void {
    Promise.resolve(null).then(() => this.setTriggerValue(value));
  }

  setTriggerValue(value) {
    const val = this.displayWith ? this.displayWith(value) : value;
    this.element.nativeElement.value = val;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO figure out what to do here
    throw new Error('Method not implemented.');
  }

  validate(c: AbstractControl): ValidationErrors | any {
    return this.typeahead.selectedOption ? null : {noneSelected: {valid: false}};
  }

  private setValueAndClose(selected: TypeaheadOptionComponent) {
    const value = selected ? selected.value : selected;
    this.typeahead.selectedOption = selected;
    this._onChange(value);
    this.setTriggerValue(value);
    this.typeahead.showPanel = false;

  }
}
