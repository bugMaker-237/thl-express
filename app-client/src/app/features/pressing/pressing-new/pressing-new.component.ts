import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { action } from 'tns-core-modules/ui/dialogs';
import '@apps.common/utils';
import { ICloth, IPressingListItem } from '~/app/models/pressing';
import { ActivatedRoute } from '@angular/router';
import { PressingService } from '~/app/features/pressing/pressing.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { GlobalStoreService } from '@apps.common/services';
@Component({
  selector: 'pressing-new',
  moduleId: module.id,
  templateUrl: './pressing-new.component.html',
  styleUrls: ['./pressing-new.component.scss'],
  providers: [PressingService],
})
export class PressingNewComponent implements OnInit {
  currentPressingItem: IPressingListItem;
  pressingRequest: {
    price: number;
    quantity: number;
    type: any;
    details: string;
  } = {} as any;
  formDisabled = false;
  addedCloths = [];
  selectedCloth = 'Choisir le vêtement';
  clothTypes: ICloth[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _pressingService: PressingService,
    private _storeService: GlobalStoreService,
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.subscribe({
      next: (data: { clothTypes: ICloth[] }) => {
        this.clothTypes = data.clothTypes;
        this.currentPressingItem =
          this._storeService.get('current-pressing-item') || ({} as any);
        const clothsToAdd = this.currentPressingItem.cloths || [];
        this.addedCloths = clothsToAdd.map((c) => {
          return this.convertTypeToId(c, c.type);
        });
      },
    });
  }
  onReturnPress(event: any) {}
  chooseCloth() {
    const options = {
      title: 'Séléction',
      message: 'Choisir un vêtement',
      cancelButtonText: 'Annuler',
      actions: this.clothTypes.map((c) => c.name),
    };

    action(options).then((result) => {
      if (result.toLowerCase() !== 'annuler') {
        this.selectedCloth = result;
      }
    });
  }
  addCloth() {
    this.pressingRequest = this.convertTypeToId(
      this.pressingRequest,
      this.selectedCloth
    );
    this.pressingRequest.price =
      this.getUnitPrice(this.pressingRequest.type) *
      this.pressingRequest.quantity;
    const obj = Object.assign({ details: '' }, this.pressingRequest);
    this.addedCloths.push(obj);
    this.pressingRequest = {} as any;
    this.selectedCloth = 'Choisir le vêtement';
  }
  convertTypeToId(pressingCloth, clothName) {
    pressingCloth.type = this.clothTypes.find((c) => c.name === clothName).id;
    return pressingCloth;
  }
  removeItem(item: any) {
    this.addedCloths = this.addedCloths.filter((x) => x !== item);
  }
  editItem(item) {
    this.pressingRequest = item;
    this.selectedCloth = this.getClothName(item.type);
    this.removeItem(item);
  }
  getUnitPrice(id: any) {
    const res = this.clothTypes.find((c) => c.id === id) || ({} as any);
    return res.price;
  }
  getClothName(id: string) {
    const res = this.clothTypes.find((c) => c.id === id) || ({} as any);
    return res.name;
  }
  save() {
    this._pressingService.savePressing(this.addedCloths).subscribe({
      next: () => {
        this._router.navigate(['../list'], {
          transition: {
            name: 'slideRight',
          },
          relativeTo: this._activatedRoute,
        });
        this.addedCloths = [];
        this.pressingRequest = {} as any;
      },
    });
  }
}
