import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'pressing-list',
  moduleId: module.id,
  templateUrl: './pressing-list.component.html',
  styleUrls: ['./pressing-list.component.scss']
})
export class PressingListComponent implements OnInit {
  articles = [];
  _a = [
    {
      date: '29 Février 2020',
      price: '12 000',
      cloths: [
        {
          type: 'Gandoura',
          price: '3 000',
          quantity: 6
        },
        {
          type: 'Chemise',
          price: '3 000',
          quantity: 14
        }
      ],
      validated: false
    },
    {
      date: '04 Février 2020',
      price: '9 000',
      cloths: [
        {
          type: 'Pantalon',
          price: '3 000',
          quantity: 3
        }
      ],
      validated: true
    }
  ];
  constructor(private _router: RouterExtensions) {}

  ngOnInit(): void {
    this.articles.push(...[...this._a, ...this._a, ...this._a, ...this._a]);
  }
  goToAdd() {
    this._router.navigate(['/app-shell/pressing/new'], {
      transition: {
        name: 'fade'
      }
    });
  }
}
