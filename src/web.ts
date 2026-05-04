import { WebPlugin } from '@capacitor/core';

import type { OriginalPhotoPickerPlugin, PickPhotoResult } from './definitions';

export class OriginalPhotoPickerWeb extends WebPlugin implements OriginalPhotoPickerPlugin {
  async pickPhoto(): Promise<PickPhotoResult> {
    throw this.unimplemented(
      'OriginalPhotoPicker is Android-only — use a standard <input type="file"> on the web.',
    );
  }
}
