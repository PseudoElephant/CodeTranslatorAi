#!/bin/bash
function prepare_node_modules_lambda_layer() {
  echo "Cleaning up workspace ..."
  rm -rf lambda-layers-node_modules

  echo "Creating layer ..."
  mkdir -p lambda-layers-node_modules/nodejs

  echo "Prepare server node_modules lambda layer ..."
  cp -r node_modules lambda-layers-node_modules/nodejs

  echo "Compressing ..."
  pushd lambda-layers-node_modules && zip -r /tmp/lambda-layers-node_modules.zip . && mv /tmp/lambda-layers-node_modules.zip ./lambda-layers-node_modules.zip

  echo "Remove unzipped files ..."
  rm -rf nodejs

  popd

  mv lambda-layers-node_modules build/layers/lambda-layers-node_modules
}
prepare_node_modules_lambda_layer