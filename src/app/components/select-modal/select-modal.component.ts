import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
})
export class SelectModalComponent {
  @Input() title = 'Select';
  @Input() options: { value: string; label: string }[] = [];
  @Input() selected = '';

  constructor(private modalCtrl: ModalController) {}

  selectOption(opt: any) {
    this.selected = opt.value;
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalCtrl.dismiss(this.selected, 'confirm');
  }
}
