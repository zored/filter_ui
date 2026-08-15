#!/bin/bash

# Create the dislike/{heic,avif,dng} directories if they don't exist
mkdir -p ./dislike/heic ./dislike/avif ./dislike/dng ./jpg

# Function to process a single file
convert_file() {
    file="$1"
    filename="${file%.*}"
    extension="${file##*.}"

    case "$extension" in
        heic|HEIC)
            # Convert HEIC to high-quality JPG
            magick "$file" \
            -auto-orient \
            -interlace JPEG \
            -sampling-factor 4:2:0 \
            -define jpeg:dct-method=float \
            -define jpeg:optimize-coding=true \
            -define jpeg:preserve-settings=true \
            -quality 88 \
            "jpg/${filename}.jpg"

            # Move original HEIC to dislike/heic
            mv "$file" ./dislike/heic/
            echo "Converted $file to ${filename}.jpg and moved original to ./dislike/heic/"
            ;;
        avif|AVIF)
            # Convert AVIF to high-quality JPG
            magick "$file" \
            -auto-orient \
            -interlace JPEG \
            -sampling-factor 4:2:0 \
            -define jpeg:dct-method=float \
            -define jpeg:optimize-coding=true \
            -define jpeg:preserve-settings=true \
            -quality 88 \
            "jpg/${filename}.jpg"

            # Move original AVIF to dislike/avif
            mv "$file" ./dislike/avif/
            echo "Converted $file to ${filename}.jpg and moved original to ./dislike/avif/"
            ;;
        dng|DNG)
            # Convert DNG to high-quality JPG
            magick "$file" \
            -auto-orient \
            -interlace JPEG \
            -sampling-factor 4:2:0 \
            -define jpeg:dct-method=float \
            -define jpeg:optimize-coding=true \
            -define jpeg:preserve-settings=true \
            -quality 88 \
            "jpg/${filename}.jpg"

            # Move original DNG to dislike/dng
            mv "$file" ./dislike/dng/
            echo "Converted $file to ${filename}.jpg and moved original to ./dislike/dng/"
            ;;
        *)
            echo "Unsupported file format: $file"
            ;;
    esac
}

export -f convert_file # Export the function for parallel execution

# Find all HEIC, AVIF, and DNG files and process them in parallel
find . -maxdepth 1 -type f \( -iname "*.HEIC" -o -iname "*.heic" -o -iname "*.AVIF" -o -iname "*.avif" -o -iname "*.DNG" -o -iname "*.dng" \) | \
xargs -P "$(nproc)" -I {} bash -c 'convert_file "$@"' _ {}
echo "Conversion complete. Originals moved to ./dislike/{heic,avif,dng}/"
