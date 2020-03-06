import { Component, OnInit } from '@angular/core';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'Packet',
  templateUrl: 'Packet.component.html',
  styleUrls: ['Packet.component.scss']
})
export class PacketComponent implements OnInit {
  selectedType = 'Choisir un type';
  packet = {};
  constructor(private _router: RouterExtensions) {}
  ngOnInit() {}
  choosePacketType() {
    const options = {
      title: 'Séléction',
      message: 'Choisir un type de colis',
      cancelButtonText: 'Annuler',
      actions: ['Plis fermé', 'Autres']
    };

    action(options).then(result => {
      if (result.toLowerCase() !== 'annuler') {
        this.selectedType = result;
      }
    });
  }
  save() {
    this._router.navigate(['/app-shell/home'], {
      transition: {
        name: 'slide'
      }
    });
  }
}
