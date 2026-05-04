import { registerPlugin } from '@capacitor/core';

import type { OriginalPhotoPickerPlugin } from './definitions';

const OriginalPhotoPicker = registerPlugin<OriginalPhotoPickerPlugin>('OriginalPhotoPicker', {
  web: () => import('./web').then((m) => new m.OriginalPhotoPickerWeb()),
});

export * from './definitions';
export { OriginalPhotoPicker };
