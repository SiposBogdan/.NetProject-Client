import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import {MatStepperModule} from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { StripeAddressElement, StripePaymentElement } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { firstValueFrom } from 'rxjs';
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CartService } from '../cart.service';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule, CheckoutDeliveryComponent, CheckoutReviewComponent, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy{
  
  
  private stripeService = inject(StripeService);
  
  private snackbar = inject(SnackbarService);
  saveAddress  =  false;
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;

  async ngOnInit(){
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
    }catch(error: any){
      this.snackbar.error(error.message);
    }
  }

  // onSaveAddressCheckboxChange(event: MatCheckboxChange){
  //   this.saveAddress = event.checked;

  // }

  async onStepChange(event: StepperSelectionEvent){

    if(event.selectedIndex === 2){
       await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
  }
 
  // private async getAddressFromStripeAddress(): Promise<Address | null> {
  //   const result = await this.addressElement?.getValue();
  //   const address = result?.value.address;

  //   if(address){
  //     return{
  //       line1: address.line1,
  //       line2: address.line2,
  //       city: address.city,
  //       country: address.country,
  //       state: address.state,
  //       postalCode: address.postal_code

  //     }

  //   }
  //   else{return null;}
  // }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}
