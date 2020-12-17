import { Component, OnInit } from '@angular/core';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import {
  GlobalStoreService,
  DialogService,
  ToastService,
} from '@apps.common/services';
import { ActivatedRoute } from '@angular/router';
import { IPacket } from '~/app/models/packet';
import { PacketService } from './packet.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'Packet',
  templateUrl: 'Packet.component.html',
  styleUrls: ['Packet.component.scss'],
  providers: [PacketService],
})
export class PacketComponent implements OnInit {
  formDisabled = false;
  selectedType = 'Choisir un type';
  packet: IPacket = {} as any;
  packetTypes: string[];
  msgs: any[];
  constructor(
    private _router: RouterExtensions,
    private _activeRoute: ActivatedRoute,
    private _storeService: GlobalStoreService,
    private _dialogService: DialogService,
    private _packetService: PacketService,
    private _translateService: TranslateService
  ) {}
  ngOnInit() {
    this._packetService.getPacketType().subscribe({
      next: (data) => {
        this.packetTypes = data;
      },
    });
    this._translateService
      .get([
        'Messages.Packet.Select',
        'Messages.Packet.Choose',
        'Messages.Packet.Continue',
        'Views.Common.BtnCancel',
        'Views.Common.BtnContinue',
        'Messages.Common.MandatoryFields',
      ])
      .subscribe({
        next: (res) => {
          this.msgs = [];
          for (const key in res) {
            this.msgs.push(res[key]);
          }
          this.selectedType = this.msgs[1];
        },
      });
  }
  choosePacketType() {
    if (this.packetTypes && this.packetTypes.length > 0) {
      const options = {
        title: this.msgs[0],
        message: this.msgs[1],
        cancelButtonText: this.msgs[3],
        actions: this.packetTypes,
      };

      action(options).then((result) => {
        if (result.toLowerCase() !== 'annuler') {
          this.selectedType = result;
        }
      });
    }
  }
  save() {
    if (
      !this.packet.weight ||
      !this.packet.value ||
      !this.packet.receiver_name ||
      !this.packet.receiver_phone ||
      this.packet.receiver_phone.length < 9 ||
      this.selectedType === this.msgs[1]
    ) {
      this._dialogService.alert(this.msgs[5], this.msgs[4]);
      return;
    }
    this._dialogService.alert(this.msgs[2], this.msgs[4]);
    this.packet.nature = this.selectedType;
    this.packet.weight = Number.parseFloat(this.packet.weight as any);
    this.packet.value = Number.parseFloat(this.packet.value as any);
    this._storeService.set('current-packet-item', this.packet);
    this._router.navigate(['../map/VIP'], {
      transition: {
        name: 'slide',
      },
      queryParams: { isPacketTransportation: true },
      relativeTo: this._activeRoute,
    });
  }
}
