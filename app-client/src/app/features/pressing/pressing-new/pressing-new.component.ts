import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { action } from 'tns-core-modules/ui/dialogs';
import '@apps.common/utils';
import { ICloth } from '~/app/models/pressing';
import { ActivatedRoute } from '@angular/router';
import { PressingService } from '~/app/features/pressing/pressing.service';
import { RouterExtensions } from 'nativescript-angular/router';
@Component({
  selector: 'pressing-new',
  moduleId: module.id,
  templateUrl: './pressing-new.component.html',
  styleUrls: ['./pressing-new.component.scss']
})
export class PressingNewComponent implements OnInit {
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
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.subscribe({
      next(data: { clothTypes: ICloth[] }) {
        this.clothTypes = data.clothTypes;
      }
    });
  }
  onReturnPress(event: any) {}
  chooseCloth() {
    const options = {
      title: 'Séléction',
      message: 'Choisir un vêtement',
      cancelButtonText: 'Annuler',
      actions: this.clothTypes.map(c => c.name)
    };

    action(options).then(result => {
      if (result.toLowerCase() !== 'annuler') {
        this.selectedCloth = result;
        this.pressingRequest.type = this.clothTypes.find(
          c => c.name === result
        ).id;
      }
    });
  }
  addCloth() {
    this.pressingRequest.price =
      this.getUnitPrice(this.pressingRequest.type) *
      this.pressingRequest.quantity;
    const obj = Object.assign({}, this.pressingRequest);
    this.addedCloths.push(obj);
    this.pressingRequest = {} as any;
    this.selectedCloth = 'Choisir le vêtement';
  }
  removeItem(item: any) {
    this.addedCloths = this.addedCloths.filter(x => x !== item);
  }
  getUnitPrice(type: any) {
    return this.clothTypes.find(c => c.id === type).unitPrice;
  }
  getClothName(index: any) {
    return this.clothTypes.find(c => c.id === index).name;
  }
  save() {
    this._pressingService.savePressing(this.addedCloths).subscribe({
      next: () => {
        this._router.navigate(['../list'], {
          transition: {
            name: 'slideRight'
          }
        });
        this.addedCloths = [];
        this.pressingRequest = {} as any;
      }
    });
  }
}
