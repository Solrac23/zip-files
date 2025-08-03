import AdmZip from "adm-zip";
import {homedir, platform} from 'node:os'

export class ZipFileService {
  private zip: AdmZip
  private basePath: Map<string, string>;
  private osType: NodeJS.Platform;

  public constructor() {
    this.zip = new AdmZip();
    this.osType = platform();
    this.basePath = new Map<string, string>();
  }

  public getOstype(): NodeJS.Platform {
    return this.osType;
  }

  public setOstype(osType: NodeJS.Platform): void {
    this.osType = osType;
  }

  public getBasePath(): Map<string, string> {
    return this.basePath;
  }

  public addBasePath(root: string, path: string): void {
    
  }
}