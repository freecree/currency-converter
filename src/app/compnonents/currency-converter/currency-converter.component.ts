import { NgFor } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ExchangeRatesService } from '../../services/exchange-rates.service';
import { BehaviorSubject } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

export enum Currencies {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
};

export type FormType<T> = {
  [P in keyof T]: T[P] extends 'object'
    ? FormGroup<FormType<T[P]>>
    : T[P] extends string
      ? FormControl<T[P]>
      : FormControl<T[P] | null>;
};

function round(num: number, fractionDigits: number = 2): number {
  return Number(num.toFixed(fractionDigits));
}

type CurrencyForm = FormGroup<FormType<{
  fromCurrencyName: Currencies,
  fromCurrencyValue: number,
  toCurrencyName: Currencies,
  toCurrencyValue: number,
}>>;

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    NgFor,
    MatCard,
    MatCardContent,
    MatInput,
    MatSelect,
    MatFormField,
    MatLabel,
    MatOption,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
})
export class CurrencyConverterComponent {
  private readonly exchangeRatesService = inject(ExchangeRatesService);
  private readonly _exchangeRate$ = new BehaviorSubject(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  public readonly currencies = Object.keys(Currencies);

  public readonly currencyForm: CurrencyForm = this.fb.group({
    fromCurrencyName: this.fb.control(Currencies.UAH, { nonNullable: true }),
    fromCurrencyValue: this.fb.control(0),
    toCurrencyName: this.fb.control(Currencies.USD, { nonNullable: true }),
    toCurrencyValue: this.fb.control(0),
  });

  constructor() {
    this.initExchangeRates();
    this.subscribeToExchangeRate();
  }

  private getField<T extends AbstractControl>(fieldName: string): T {
    return this.currencyForm.get(fieldName) as T
  }

  private initExchangeRates() {
    const { fromCurrencyName, toCurrencyName } = this.currencyForm.getRawValue()

    this.exchangeRatesService.getConvertedCurrency( fromCurrencyName, toCurrencyName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rate) => {
        this._exchangeRate$.next(rate);
      });
  }

  private subscribeToExchangeRate() {
    this._exchangeRate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateToCurrencyValue();
    });
  }

  public updateToCurrencyValue() {
    const value = this._exchangeRate$.value * this.getField('fromCurrencyValue').value
    this.getField('toCurrencyValue').patchValue(round(value))
  }

  public updateFromCurrencyValue() {
    const value = this.getField('toCurrencyValue').value / this._exchangeRate$.value;
    this.getField('fromCurrencyValue').patchValue(round(value));
  }

  public updateCurrencyRate() {
    const fromCurrencyName = this.getField('fromCurrencyName').value;
    const toCurrencyName = this.getField('toCurrencyName').value;

    this.exchangeRatesService.getConvertedCurrency(fromCurrencyName, toCurrencyName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this._exchangeRate$.next(round(value));
      }
    );
  }
}
