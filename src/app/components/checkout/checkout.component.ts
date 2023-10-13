import { Luv2ShopFormService } from './../../services/luv2-shop-form.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);
    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrived Cart month: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
    this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrived credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });
    this.luv2ShopFormService.getCountries().subscribe((data) => {
      console.log('Retrived Countries: ' + data + JSON.stringify(data));
      this.countries = data;
    });
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      // this.checkoutFormGroup.controls.billingAddress
      //       .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(
      'The email address is ' +
        this.checkoutFormGroup.get('customer').value.email
    );
    console.log(
      'The shipping address is ' +
        this.checkoutFormGroup.get('shippingAddress').value.country.name
    );
    console.log(
      'The shipping address is ' +
        this.checkoutFormGroup.get('shippingAddress').value.state.name
    );
  }
  handelMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrived Cart month: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log('{formGroupName} country code:' + countryCode);
    console.log('{formGroupName} country name:' + countryName);
    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup.get('state').setValue(data[0]);
    });
  }
}
