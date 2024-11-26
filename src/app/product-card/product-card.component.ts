// product-card/product-card.component.ts

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-resturent-card',
    templateUrl: './product-card.component.html',
    standalone: true
})
export class ResturentCardComponent {
    @Input() restaurant: any;
}