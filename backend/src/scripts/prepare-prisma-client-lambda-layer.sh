#!/bin/bash
function prepare_prisma_client_lambda_layer() {
  echo "Cleaning up workspace ..."
  rm -rf lambda-layers-prisma-client

  echo "Creating layer ..."
  mkdir -p lambda-layers-prisma-client/nodejs/node_modules/.prisma
  mkdir -p lambda-layers-prisma-client/nodejs/node_modules/@prisma

  echo "Prepare Prisma Client lambda layer ..."
  cp -r node_modules/.prisma/client lambda-layers-prisma-client/nodejs/node_modules/.prisma
  cp -r node_modules/@prisma lambda-layers-prisma-client/nodejs/node_modules

  echo "Remove Prisma CLI..."
  rm -rf lambda-layers-prisma-client/nodejs/node_modules/@prisma/cli

  echo "Compressing ..."
  pushd lambda-layers-prisma-client && zip -r /tmp/lambda-layers-prisma-client.zip . && mv /tmp/lambda-layers-prisma-client.zip ./lambda-layers-prisma-client.zip

  echo "Remove unzipped files ..."
  rm -rf nodejs

  popd

  mv lambda-layers-prisma-client ./build/layers/lambda-layers-prisma-client
}
prepare_prisma_client_lambda_layer