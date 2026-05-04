# capacitor-original-photo-picker

A Capacitor plugin that picks a photo from the Android gallery and returns the **original** file with EXIF GPS preserved.

## Why this exists

Android's system photo picker (and the `@capacitor/camera` plugin's `chooseFromGallery`) returns a privacy-stripped copy of the image: GPS coordinates are zeroed before the file ever reaches your app. The only escape hatch is calling [`MediaStore.setRequireOriginal`](https://developer.android.com/reference/android/provider/MediaStore#setRequireOriginal(android.net.Uri)) on the picked URI, with the `ACCESS_MEDIA_LOCATION` permission granted.

The upstream Capacitor Camera plugin does not implement this — see issues [#1074](https://github.com/ionic-team/capacitor-plugins/issues/1074), [#2118](https://github.com/ionic-team/capacitor-plugins/issues/2118), [#2147](https://github.com/ionic-team/capacitor-plugins/issues/2147), all closed without a fix. This plugin fills that gap.

## Install

This package is not published to npm. Install directly from the git repo:

```sh
npm install github:observ-ing/capacitor-original-photo-picker
npx cap sync android
```

Pin to a tag or commit for reproducible builds:

```sh
npm install github:observ-ing/capacitor-original-photo-picker#v0.1.0
```

## Platforms

| Platform | Support |
| --- | --- |
| Android | yes (this is the whole point) |
| iOS | not implemented — iOS's `PHPicker` already preserves EXIF when the right permission is granted, so use `@capacitor/camera` there |
| Web | not implemented — use a standard `<input type="file">` |

## Permissions

The plugin requests these at first call:

- `READ_MEDIA_IMAGES` — Android 13+. Lets the user pick from their library (or grant a partial selection via Android 14's Selected Photos flow).
- `ACCESS_MEDIA_LOCATION` — Android 10+. Required for `setRequireOriginal` to return the unstripped file.

Both are declared in the plugin's `AndroidManifest.xml` and merge into your app at build time.

## Usage

```ts
import { OriginalPhotoPicker } from 'capacitor-original-photo-picker';

const result = await OriginalPhotoPicker.pickPhoto();
if (result.cancelled) return;

const blob = base64ToBlob(result.base64!, result.mimeType ?? 'image/jpeg');
const file = new File([blob], result.filename ?? `photo-${Date.now()}.jpg`, {
  type: blob.type,
});

// EXIF (including GPS) is intact; pass the file to your usual EXIF parser.
```

## API

### `pickPhoto()`

Opens the system gallery, returns the picked image as base64.

- Android only. Calling on iOS/web rejects with `unimplemented`.
- Resolves with `{ cancelled: true }` if the user dismisses the picker.
- Otherwise resolves with `{ cancelled: false, base64, mimeType, filename }`.

```ts
interface PickPhotoResult {
  cancelled: boolean;
  base64?: string;
  mimeType?: string;
  filename?: string;
}
```

## How it works

1. `Intent.ACTION_PICK` against `MediaStore.Images.Media.EXTERNAL_CONTENT_URI` — this returns a real MediaStore URI (`content://media/external/images/media/123`). The newer photo picker (`content://media/picker/...`) URIs are scoped to the picker session and don't support `setRequireOriginal`.
2. Some providers (Google Photos) wrap the MediaStore URI inside their own non-exported provider. The plugin unwraps to the inner `content://media/...` when present.
3. `MediaStore.setRequireOriginal(uri)` + `ContentResolver.openInputStream` returns the unstripped file bytes.
4. The bytes are base64-encoded back to JS along with the mime type and original filename.

## License

Dual-licensed under either:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE))
- MIT license ([LICENSE-MIT](LICENSE-MIT))

at your option.
