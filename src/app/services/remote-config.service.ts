import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  RemoteConfig
} from 'firebase/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfig;

  constructor() {
    const app = initializeApp(environment.firebase);

    this.remoteConfig = getRemoteConfig(app);
    this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    this.remoteConfig.defaultConfig = {
      enable_categories: true
    };
  }

  async isCategoriesEnabled(): Promise<boolean> {
    try {
      await fetchAndActivate(this.remoteConfig);

      return getValue(this.remoteConfig, 'enable_categories').asBoolean();
    } catch {
      return true;
    }
  }
}
