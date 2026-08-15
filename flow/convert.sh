#!/bin/bash
set -e

pushd video
mkdir -p ../video_x264
for f in *; do
    ffmpeg -i "${f}" -c:v libx264 -crf 18 -c:a copy "../video_x264/${f}"
done
