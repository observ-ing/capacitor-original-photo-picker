export interface OriginalPhotoPickerPlugin {
  /**
   * Open the system gallery and return the picked image as base64,
   * with the original EXIF — including GPS — preserved.
   *
   * Resolves with `{ cancelled: true }` if the user dismisses the picker.
   * Otherwise resolves with the file's base64-encoded bytes, mime type,
   * and (when available) original filename.
   *
   * Android only. On other platforms the call rejects.
   */
  pickPhoto(): Promise<PickPhotoResult>;
}

export interface PickPhotoResult {
  cancelled: boolean;
  base64?: string;
  mimeType?: string;
  filename?: string;
}
