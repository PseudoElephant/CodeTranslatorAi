rm -rf build

mkdir -p build/layers

echo "Transpiling functions ..."
npm run build 2>&1 | tee build.log

echo "Preparing layers ..."

# Prepare libs lambda layer
echo "Preparing libs lambda layer ..."
bash ./src/scripts/prepare-libs-lambda-layer.sh 2>&1 | tee build.log

echo "Preparing node_modules ..."
npm ci --omit=dev
bash ./src/scripts/prepare-node-modules-lambda-layer.sh 2>&1 | tee build.log

# Prepare Prisma Client lambda layer
echo "Preparing Prisma Client lambda layer ..."
npm i   2>&1 | tee build.log
npm run prisma:generate:prod 2>&1 | tee build.log
bash ./src/scripts/prepare-prisma-client-lambda-layer.sh 2>&1 | tee build.log

mkdir -p build/src
mv build/functions build/src/functions 2>&1 | tee build.log

echo "Zipping ..."

# zip all folders in functions folder

# build with parent folder name
for f in build/src/functions/*; do
  if [ -d "$f" ]; then
    echo "Zipping $f ..."
    pushd $f
    cd ..
    zip -r $(basename $f).zip $(basename $f) && mv $(basename $f).zip $(basename $f)/$(basename $f).zip
    popd
  fi
done

# deploy with sls
cp serverless.yml build/serverless.yml
cp .env build/.env

echo "Deploying with serverless ..."
pushd build

# if offline mode is enabled, start serverless offline
if [ "$1" == "offline" ]; then
  # unzip all lambda layers
  for f in build/layers/*; do
    if [ -d "$f" ]; then
      echo "Unzipping $f ..."
      pushd $f
      unzip $(basename $f).zip
      popd
    fi
  done

  mkdir node_modules
  # move all node_modules from layers so common_folder
  for f in build/layers/*; do
    if [ -d "$f" ]; then
      echo "Moving node_modules from $f ..."
      pushd $f
      mv nodejs/node_modules/* ../../node_modules
      popd
    fi
  done

  # set nodepath to common_folder
  export NODE_PATH=../../node_modules

  echo "Starting serverless offline ..."
  sls offline --stage dev --aws-profile translator
fi
else
  echo "Deploying with serverless deploy ..."
  sls deploy --stage dev --verbose --aws-profile translator
fi

popd

echo "Cleaning up ..."
rm -rf build
