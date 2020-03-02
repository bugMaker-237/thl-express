import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { action } from 'tns-core-modules/ui/dialogs';
import '@apps.common/utils';
@Component({
  selector: 'pressing-new',
  moduleId: module.id,
  templateUrl: './pressing-new.component.html',
  styleUrls: ['./pressing-new.component.scss']
})
export class PressingNewComponent implements OnInit {
  pressingRequest: any = {};
  formDisabled = false;
  addedCloths = [];
  selectedCloth = 'Choisir le vêtement';
  clothTypes = ['Gandoura', 'pantalon', 'Chemise'];
  constructor(private page: Page) {}

  ngOnInit(): void {
    this.addedCloths.push({
      type: 1,
      quantity: 6,
      price: '5 600'
    });
  }
  onReturnPress(event) {}
  chooseCloth() {
    const options = {
      title: 'Séléction',
      message: 'Choisir un vêtement',
      cancelButtonText: 'Annuler',
      actions: this.clothTypes
    };

    action(options).then(result => {
      if (result.toLowerCase() !== 'annuler') {
        this.selectedCloth = result;
        this.pressingRequest.type = this.clothTypes.indexOf(result);
      }
    });
  }
  addCloth() {
    this.pressingRequest.price =
      this.getUnitPrice(this.pressingRequest) * this.pressingRequest.quantity;
    const obj = Object.assign({}, this.pressingRequest);
    this.addedCloths.push(obj);
    this.pressingRequest = {};
    this.selectedCloth = 'Choisir le vêtement';
  }
  removeItem(item) {
    this.addedCloths = this.addedCloths.filter(x => x !== item);
  }
  getUnitPrice(type) {
    return 500;
  }
  getClothName(index) {
    return this.clothTypes[index];
  }
  save() {
    console.log(this.addedCloths);
  }
}
