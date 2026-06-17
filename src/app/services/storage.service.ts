import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageReady: Promise<Storage>;

  constructor(private storage: Storage) {
    this.storageReady = this.storage.create();
  }

  private async getStorage(): Promise<Storage> {
    return this.storageReady;
  }

  async set(key: string, value: any) {
    const storage = await this.getStorage();
    await storage.set(key, value);
  }

  async get(key: string) {
    const storage = await this.getStorage();
    return await storage.get(key);
  }

  async remove(key: string) {
    const storage = await this.getStorage();
    await storage.remove(key);
  }

}
