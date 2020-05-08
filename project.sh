#!/bin/sh
set -ex
case $1 in
  publish-via-docker)
    docker run --rm \
      -v "/$PWD:/build" \
      --workdir=//build \
      --env GH_TOKEN=$GH_TOKEN \
      node:14.2.0-alpine3.11 \
      //bin/sh -c "
          yarn install &&
          yarn run lint &&
          yarn run publish
      "
    ;;
esac
