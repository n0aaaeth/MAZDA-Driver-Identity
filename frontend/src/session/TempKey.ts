import { secp256k1 } from "@noble/curves/secp256k1";
import { LocalStorage } from "./storage/local-storage";
import { StorageKeys } from "./storage/storage-keys";
import { SigningKey } from "@ethersproject/signing-key";
import {
  arrayify,
  Bytes,
  BytesLike,
  joinSignature,
} from "@ethersproject/bytes";
import { computeAddress } from "@ethersproject/transactions";
import { hashMessage } from "@ethersproject/hash";

export class TempKey extends SigningKey {
  private static readonly storage = new LocalStorage();

  public constructor(
    privateKey: BytesLike = secp256k1.utils.randomPrivateKey()
  ) {
    super(privateKey);
  }

  public sign(message: Bytes | string): string {
    return joinSignature(this.signDigest(hashMessage(arrayify(message))));
  }

  public save(): void {
    TempKey.storage.save(StorageKeys.SESSION_KEY, this.privateKey);
  }

  public remove(): void {
    TempKey.storage.remove(StorageKeys.SESSION_KEY);
  }

  public static load(): TempKey | null {
    const privateKey = TempKey.storage.get(StorageKeys.SESSION_KEY);
    return privateKey ? new TempKey(arrayify(privateKey)) : null;
  }

  public get address(): string {
    return computeAddress(this.privateKey);
  }
}
