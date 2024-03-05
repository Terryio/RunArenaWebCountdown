import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-twitch-player',
  standalone: true,
  imports: [],
  templateUrl: './twitch-player.component.html',
  styleUrl: './twitch-player.component.scss',
})
export class TwitchPlayerComponent {
  @Input()
  public channel: string = '';

  protected divEmbed: string = `twitch-embed`;

  protected siteUrl: string = environment.siteUrl;

  protected iframeUrl?: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.divEmbed = `twitch-embed-${this.channel}`;
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${this.channel}&parent=${this.siteUrl}`);
  }
}
