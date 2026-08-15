# How I move files from iPhone to Google Drive

- Preparation.
- Copy files to computer using [3uTools](http://www.3u.com/).
- Rename files with [Deno](https://deno.com/):
```bash
deno run -A --unstable rename.ts save-renames
deno run -A --unstable rename.ts rename
```
- Remove `.WEBP` files because they are trash.
- Run `./heic.sh` to convert HEIC to JPEG.
- Move video files:
```bash
mkdir -p ./video
mv *.MP4 *.MOV ./video
```
- Run `./convert.sh`.
- Wait for million years.
- Check `./video_x264` and remove `./video`.
- Review media collection
    - Use [Filter UI](https://github.com/zored/filter_ui).
    - 2 seconds videos are live videos from photos. Review them separately if needed.
- Send results to cloud storage.
