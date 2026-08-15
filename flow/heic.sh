#!/bin/bash
set -euo pipefail

target_dir="${1:-.}"
if [[ ! -d "$target_dir" ]]; then
    printf 'Directory does not exist: %s\n' "$target_dir" >&2
    exit 2
fi

cd "$target_dir"

# JPEG previews are for review only; the original files remain untouched in originals/.
review_dir="./review"
originals_dir="./originals"
manifest="$review_dir/manifest.tsv"
jobs="${JOBS:-4}"
jpeg_quality="${JPEG_QUALITY:-90}"

mkdir -p "$review_dir" \
    "$originals_dir/heic" \
    "$originals_dir/avif" \
    "$originals_dir/dng"

# Prevent every parallel ImageMagick process from also using every CPU core.
export MAGICK_THREAD_LIMIT="${MAGICK_THREAD_LIMIT:-1}"

convert_file() {
    local file="$1"
    local filename stem extension kind preview original tmp

    filename="${file##*/}"
    stem="${filename%.*}"
    extension="${filename##*.}"
    kind="${extension,,}"

    case "$kind" in
        heic|avif|dng) ;;
        *)
            printf 'Unsupported file format: %s\n' "$file" >&2
            return 1
            ;;
    esac

    # Include the source extension to avoid IMG_0001.HEIC and IMG_0001.AVIF
    # overwriting one another when converted in parallel.
    preview="$review_dir/${stem}.${kind}.jpg"
    original="$originals_dir/$kind/$filename"

    if [[ -e "$preview" || -e "$original" ]]; then
        printf 'Refusing to overwrite existing output for: %s\n' "$file" >&2
        return 1
    fi

    tmp="$(mktemp "$review_dir/.${filename}.XXXXXX.jpg")"
    if ! magick "${file}[0]" \
        -auto-orient \
        -interlace JPEG \
        -sampling-factor 4:2:0 \
        -define jpeg:optimize-coding=true \
        -quality "$jpeg_quality" \
        "$tmp"; then
        rm -f -- "$tmp"
        return 1
    fi

    mv -- "$tmp" "$preview"
    if ! mv -n -- "$file" "$original"; then
        printf 'Preview created but original could not be moved: %s\n' "$file" >&2
        return 1
    fi

    # A manifest allows a later review step to map a chosen JPEG preview
    # back to the original HEIC, AVIF, or DNG file.
    printf '%s\t%s\n' "$preview" "$original" >> "$manifest"
    printf 'Created preview %s; archived original in %s\n' "$preview" "$original"
}

export -f convert_file
export review_dir originals_dir manifest jpeg_quality

# -print0 / -0 make spaces, quotes, and newlines in filenames safe.
find . -maxdepth 1 -type f \( \
    -iname '*.heic' -o -iname '*.avif' -o -iname '*.dng' \
\) -print0 | xargs -0 -r -n 1 -P "$jobs" bash -c 'convert_file "$1"' _

printf 'Conversion complete. Review JPEG previews in %s; originals are in %s.\n' \
    "$review_dir" "$originals_dir"
