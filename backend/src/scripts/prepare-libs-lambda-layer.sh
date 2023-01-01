#!/bin/bash
function prepare_libs_lambda_layer() {
  echo "Cleaning up ..."
  rm -rf lambda-layers-libs

  echo "Creating layer ..."
  mkdir -p lambda-layers-libs/nodejs/node_modules/@libs
  mv build/libs build/@libs

  echo "Prepare libs lambda layer ..."
  cp -r build/@libs lambda-layers-libs/nodejs/node_modules

  echo "Compressing (zip) ..."
  pushd lambda-layers-libs && zip -r /tmp/lambda-layers-libs.zip . && mv /tmp/lambda-layers-libs.zip ./lambda-layers-libs.zip

  echo "Remove unzipped files ..."
  rm -rf nodejs
  
  popd

  mv lambda-layers-libs build/layers/lambda-layers-libs
}
prepare_libs_lambda_layer