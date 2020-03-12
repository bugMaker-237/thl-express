import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular/router';
import { IPressingListItem } from '~/app/models/pressing';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pressing-list',
  moduleId: module.id,
  templateUrl: './pressing-list.component.html',
  styleUrls: ['./pressing-list.component.scss']
})
export class PressingListComponent implements OnInit {
  articles: IPressingListItem[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: RouterExtensions
  ) {}

  ngOnInit() {
    this._activatedRoute.data.subscribe({
      next: (data: { pressings: IPressingListItem[] }) => {
        this.articles = data.pressings;
      }
    });
  }

  goToAdd() {
    this._router.navigate(['/app-shell/pressing/new'], {
      transition: {
        name: 'fade'
      }
    });
  }
}
