import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return !isPlatformBrowser(this.platformId);
  }

  getWindow(): Window | null {
    return this.isBrowser() ? window : null;
  }

  getDocument(): Document | null {
    return this.isBrowser() ? document : null;
  }

  getGoogle(): any {
    return this.isBrowser() ? (window as any).google : null;
  }
} 