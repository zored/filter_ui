# How I move files from iPhone to Google Drive

- Preparation.
- Copy files to computer using [3uTools](http://www.3u.com/).
- Every command accepts a target media directory. If omitted, the current directory is used.
  In Git Bash use paths such as `/c/Users/BAZA/Pictures/import`; in WSL use `/mnt/c/Users/BAZA/Pictures/import`.
- Rename files with [Deno](https://deno.com/):
```bash
deno run -A rename.ts save-renames "/path/to/media"
deno run -A rename.ts rename "/path/to/media"
```
  `renames.json` is stored in that media directory.
- Move `.WEBP` files to `trash/`; do not delete them during review.
- Run `./heic.sh "/path/to/media"` to create JPEG previews in `review/` and archive originals in `originals/`.
- Move video files:
```bash
media_dir="/path/to/media"
mkdir -p "$media_dir/video"
mv "$media_dir"/*.MP4 "$media_dir"/*.MOV "$media_dir/video"
```
- Run `./convert.sh "/path/to/media"`.
- Wait for million years.
- Check `./video_x264` and retain `./video` until the result is backed up.
- Review media collection
    - Use [Filter UI](https://github.com/zored/filter_ui).
    - 2 seconds videos are live videos from photos. Review them separately if needed.
- Send results to cloud storage.

## Notes and operating guide

This section records the practical decisions behind the flow without adding
complexity to the checklist above.
    
### Safe directories

- `trash/` holds unwanted files such as WEBP. Files are moved there, never
  deleted by this flow.
- `originals/{heic,avif,dng}/` holds the untouched source images after
  `heic.sh` succeeds.
- `review/` holds JPEG previews and `manifest.tsv`, which maps every preview
  to its original file.
- `video/` holds source MOV/MP4 files before transcoding; `video_x264/` holds
  the converted MP4 files. Retain `video/` until the result is checked and
  backed up; this flow does not delete it.

### Commands from Git Bash

Run the scripts from this repository's `flow/` directory. For example:

```bash
media_dir="/d/my-phone-08-26/Camera Roll"

./heic.sh "$media_dir"
./convert.sh "$media_dir"
```

All scripts accept a target directory; omitting it means the current directory.
`rename.ts` keeps `renames.json` in the selected target. Before applying a
large rename, generate and inspect that plan first.

### Image previews

`heic.sh` uses ImageMagick on the CPU. It creates progressive JPEG previews at
quality 90 with 4:2:0 chroma sampling, a good review-size compromise. Tune it
per run when needed:

```bash
JOBS=8 JPEG_QUALITY=92 ./heic.sh "$media_dir"
```

The original HEIC, AVIF, and especially DNG files are archival sources: use
the JPEG only for filtering and keep the originals until the review decision
has been applied to them.

### Video conversion

`convert.sh` uses Nvidia NVENC H.264 with `CQ 19`, preset `p6`, and quality
tuning. It is much faster than CPU `libx264` and remains compatible with the
current Filter UI and common cloud players. `CQ` is NVENC-specific and is not
a direct numeric equivalent of `libx264`'s `CRF`.

For smaller files, try a higher CQ value such as 21-23; for higher visual
quality, try 17. AV1 NVENC can be a better archival format, but older Electron
versions may not play it in Filter UI.
