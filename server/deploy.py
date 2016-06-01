#
# Script to deploy top secret stack with latest game content
#

import os
import shutil
import subprocess

dirname = 'tmp-deploy'
zipname = 'topsecret'
zipname_with_ext = zipname + '.zip'
s3bucketname = 'topsecret-deploy'

# Create temp folder for game assets
os.makedirs(dirname)

# Clone game content into temp folder
subprocess.call('git clone --depth 1 git@github.com:jameslong/topsecret-content.git ' + dirname + '/topsecret-content', shell=True)
subprocess.call('git clone --depth 1 git@github.com:jameslong/topsecret.git ' + dirname + '/topsecret', shell=True)

# Copy credentials
subprocess.call('cp -r server/credentials ' + dirname + '/topsecret/server', shell=True)

# Install dependencies
os.chdir(dirname + '/topsecret')
subprocess.call('npm install', shell=True)
subprocess.call('grunt server', shell=True)
os.chdir('../../')

# Zip content
shutil.make_archive(zipname, 'zip', dirname)

# Upload to s3 bucket
subprocess.call('aws s3 cp ' + zipname_with_ext + ' s3://' + s3bucketname, shell=True)

# Delete zipped file
os.remove(zipname_with_ext)

# Delete temp folder
shutil.rmtree(dirname)
