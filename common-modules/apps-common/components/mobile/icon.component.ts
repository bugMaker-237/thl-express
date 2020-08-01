import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'core-ui-icon',
  styles: [
    `
      .mdi {
        font-family: 'Material Icons', 'MaterialIcons-Regular';
      }
    `
  ],
  template: `
    <Label
      [verticalAlignment]="verticalAlignment"
      [horizontalAlignment]="horizontalAlignment"
      (tap)="launchEvent($event)"
      [class]="customStyle + ' ' + customClass + ' mdi m-l-2 m-r-2'"
      [style]="getStyle()"
      [text]="name"
    >
    </Label>
  `
})
export class IconComponent {
  public customStyle = '';
  public color = '';
  @Input() name: string;
  @Input() rotate = 0;
  @Input() customClass: string;
  @Input() horizontalAlignment = 'center';
  @Input() verticalAlignment = 'center';
  @Input() size = 24;
  @Input()
  set backColor(val: string) {
    if (['primary', 'accent', 'warn'].indexOf(val) > -1) {
      this.customStyle = 'icon-' + val;
      this.color = 'inherit';
    } else {
      this.color = val;
    }
  }
  @Output() tapAction = new EventEmitter<any>();

  constructor() {}
  launchEvent($event) {
    this.tapAction.emit($event);
  }
  getStyle() {
    return `font-color:${this.color};font-size:${this.size}px;transform: rotate(${this.rotate}deg)`;
  }
}
