import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular/router';
import { IPressingListItem } from '~/app/models/pressing';
import { ActivatedRoute } from '@angular/router';
import { PaginatedData, IPagination } from '@apps.common/models';
import { GlobalStoreService } from '@apps.common/services';

@Component({
  selector: 'pressing-list',
  moduleId: module.id,
  templateUrl: './pressing-list.component.html',
  styleUrls: ['./pressing-list.component.scss']
})
export class PressingListComponent implements OnInit {
  articles: IPressingListItem[] = [];
  pagination: IPagination;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: RouterExtensions,
    private _storeService: GlobalStoreService
  ) {}

  ngOnInit() {
    this._activatedRoute.data.subscribe({
      next: (data: { pressings: PaginatedData<IPressingListItem> }) => {
        this.articles = data.pressings.data;
        this.pagination = data.pressings.pagination;
      }
    });
  }

  goToAdd() {
    this._storeService.remove('current-pressing-item');
    this._router.navigate(['../new'], {
      transition: {
        name: 'fade'
      },
      relativeTo: this._activatedRoute
    });
  }
  pay(item: IPressingListItem) {
    this._storeService.set('ONGOING_PAYMENT', {
      type: 'pressing',
      journeyId: item.id,
      origin: {},
      destination: {},
      price: item.price,
      redirectUrl: '../history/PRESSING'
    });
    this._router.navigate(['../../pay-service'], {
      transition: {
        name: 'slide'
      },
      relativeTo: this._activatedRoute
    });
  }
  update(item) {
    this._storeService.set('current-pressing-item', item);
    this._router.navigate(['../new'], {
      transition: {
        name: 'fade'
      },
      relativeTo: this._activatedRoute
    });
  }
}
