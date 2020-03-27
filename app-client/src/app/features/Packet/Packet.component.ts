import { Component, OnInit } from '@angular/core';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import {
  GlobalStoreService,
  DialogService,
  ToastService
} from '@apps.common/services';
import { ActivatedRoute } from '@angular/router';
import { IPacket } from '~/app/models/packet';
import { PacketService } from './packet.service';

@Component({
  selector: 'Packet',
  templateUrl: 'Packet.component.html',
  styleUrls: ['Packet.component.scss'],
  providers: [PacketService]
})
export class PacketComponent implements OnInit {
  formDisabled = false;
  selectedType = 'Choisir un type';
  packet: IPacket = {} as any;
  packetTypes: string[];
  constructor(
    private _router: RouterExtensions,
    private _activeRoute: ActivatedRoute,
    private _storeService: GlobalStoreService,
    private _dialogService: DialogService,
    private _packetService: PacketService
  ) {}
  ngOnInit() {
    this._packetService.getPacketType().subscribe({
      next: data => {
        this.packetTypes = data;
      }
    });
  }
  choosePacketType() {
    if (this.packetTypes.length > 0) {
      const options = {
        title: 'Séléction',
        message: 'Choisir un type de colis',
        cancelButtonText: 'Annuler',
        actions: this.packetTypes
      };

      action(options).then(result => {
        if (result.toLowerCase() !== 'annuler') {
          this.selectedType = result;
        }
      });
    }
  }
  save() {
    this._dialogService.alert(
      'Vous devez poursuivre avec la commande de votre course.',
      'Poursuivre'
    );
    this._storeService.set('current-packet-item', this.packet);
    this._router.navigate(['../map/VIP'], {
      transition: {
        name: 'slide'
      },
      queryParams: { isPacketTransportation: true },
      relativeTo: this._activeRoute
    });
  }
}
