import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { SupportService } from '../../services';
import { ToastService } from '@apps.common/services';

@Component({
  selector: 'complain',
  templateUrl: 'complain.component.html',
  styleUrls: ['complain.component.scss'],
})
export class ComplainComponent implements OnInit {
  isFragment: boolean;
  complain: any = {};
  formDisabled = false;
  constructor(
    private _route: ActivatedRoute,
    private _router: RouterExtensions,
    private _toastService: ToastService,
    private _spportService: SupportService
  ) {}
  ngOnInit() {
    this._route.data.subscribe((data: { isFragment: boolean }) => {
      this.isFragment = data.isFragment;
    });
  }
  onReturnPress(event) {}

  send() {
    this._spportService.complain(this.complain).subscribe({
      next: () => {
        this._toastService.push({
          text: 'Commentaire envoyé!',
          data: {
            backgroundColor: 'primary',
          },
        });
        this.complain = {};
      },
    });
  }
}
