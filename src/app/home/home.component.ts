import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Duration, intervalToDuration } from 'date-fns';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil, timer } from 'rxjs';
import { storageKeyLanguage } from '../consts/shared.const';
import { Language } from '../enums/language.enum';
import { StorageService } from '../services/storage.service';
import { TwitchPlayerComponent } from '../twitch-player/twitch-player.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule, TwitchPlayerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected currentLang: string = Language.en;

  protected days: string = '00';
  protected hours: string = '00';
  protected minutes: string = '00';
  protected seconds: string = '00';

  private endTime: Date;

  private onDestroy$ = new Subject<void>();

  constructor(private primengConfig: PrimeNGConfig, private translateService: TranslateService, private storageService: StorageService) {
    this.endTime = new Date(Date.UTC(2024, 3, 15, 19, 0, 0));

    this.initializeClock();

    // Manage language
    const lang: string = this.storageService.getStoragePropertyIfExists(storageKeyLanguage, false) ?? Language.en;
    this.translateService.setDefaultLang(lang);
    this.translateService.addLangs([Language.en, Language.fr]);
    this.translate(lang);
  }

  protected translate(lang: string) {
    this.storageService.storeProperty(storageKeyLanguage, lang, false);
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res));
    this.currentLang = lang;
  }

  private initializeClock(): void {
    timer(0, 1000)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.updateClock();
      });
  }

  private getTimeRemaining(endtime: Date): Duration {
    return intervalToDuration({
      start: new Date(),
      end: endtime,
    });
  }

  private updateClock(): void {
    const t = this.getTimeRemaining(this.endTime);

    this.days = ('00' + (t.days ?? 0)).slice(-2);
    this.hours = ('00' + (t.hours ?? 0)).slice(-2);
    this.minutes = ('00' + (t.minutes ?? 0)).slice(-2);
    this.seconds = ('00' + (t.seconds ?? 0)).slice(-2);
  }

  public ngOnDestroy(): void {
    this.destroyIntervalRefresh();
  }

  protected openBlank(url: string): void {
    window.open(url, '_blank');
  }

  private destroyIntervalRefresh(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
