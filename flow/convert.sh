#!/bin/bash
set -e

target_dir="${1:-.}"
if [[ ! -d "$target_dir" ]]; then
    printf 'Directory does not exist: %s\n' "$target_dir" >&2
    exit 2
fi

cd "$target_dir"
pushd video
mkdir -p ../video_x264
for f in *; do
    ffmpeg -hide_banner -n -hwaccel cuda -i "$f" \
        -map 0:v:0 -map 0:a? -map_metadata 0 \
        -c:v h264_nvenc -preset p6 -tune hq \
        -rc vbr -cq 19 -b:v 0 \
        -spatial-aq 1 -temporal-aq 1 -aq-strength 8 \
        -pix_fmt yuv420p \
        -c:a copy -movflags +faststart \
        "../video_x264/${f%.*}.mp4"
done
