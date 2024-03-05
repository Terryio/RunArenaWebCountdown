import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Retourne la valeur stockée dans le storage
   * Lève une erreur si la propriété n'est pas présente dans le storage
   * @param storageKey La clé à rechercher dans le storage
   */
  public getStorageProperty<T>(storageKey: string, session: boolean = true): T {
    const result = this.getStoragePropertyIfExists<T>(storageKey, session);

    if (result) {
      return result;
    }

    throw new Error(`La valeur ${storageKey} n'est pas présente dans le storage.`);
  }

  /**
   * Enregistre l'élément fourni dans le storage
   * @param storageKey La clé à positionner dans le storage
   * @param toBeStored L'élément à stocker dans le storage
   */
  public storeProperty(storageKey: string, toBeStored: unknown, session: boolean = true): void {
    session ? sessionStorage.setItem(storageKey, JSON.stringify(toBeStored)) : localStorage.setItem(storageKey, JSON.stringify(toBeStored));
  }

  public existsProperty(storageKey: string, session: boolean = true): boolean {
    if (session ? sessionStorage.getItem(storageKey) : localStorage.getItem(storageKey)) {
      return true;
    }

    return false;
  }

  /**
   * Retourne la valeur stockée dans le storage ou undefined
   * si la propriété n'est pas présente dans le storage
   * @param storageKey La clé à rechercher dans le storage
   */
  public getStoragePropertyIfExists<T>(storageKey: string, session: boolean = true): T | undefined {
    const jsonData = session ? sessionStorage.getItem(storageKey) : localStorage.getItem(storageKey);

    if (!jsonData) {
      return undefined;
    }

    return JSON.parse(jsonData, this.reviver) as T;
  }

  /**
   * Supprime la clé dans le storage
   * @param storageKey La clé à supprimer dans le storage
   */
  public removeStorageProperty(storageKey: string, session: boolean = true): void {
    session ? sessionStorage.removeItem(storageKey) : localStorage.removeItem(storageKey);
  }

  public clearAll(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  private reviver(key: string, value: unknown): unknown {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (typeof value === 'string' && dateFormat.test(value)) {
      return new Date(value);
    }

    return value;
  }
}
