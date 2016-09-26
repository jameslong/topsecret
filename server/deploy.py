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
print 'Creating temporary asset folder...'
os.makedirs(dirname)

# Clone game content into temp folder
print 'Cloning content into asset folder...'
subprocess.call('git clone --depth 1 git@github.com:jameslong/topsecret-content.git ' + dirname + '/topsecret-content', shell=True)
subprocess.call('git clone --depth 1 git@github.com:jameslong/topsecret.git ' + dirname + '/topsecret', shell=True)

# Copy credentials
print 'Copying credentials...'
subprocess.call('cp server/credentials.json ' + dirname + '/topsecret/server', shell=True)

# Install dependencies
print 'Installing dependencies...'
os.chdir(dirname + '/topsecret')
subprocess.call('npm install', shell=True)
subprocess.call('grunt server', shell=True)
os.chdir('../../')

# Zip content
print 'Zipping content...'
shutil.make_archive(zipname, 'zip', dirname)

# Upload to s3 bucket
print 'Uploading to S3...'
subprocess.call('aws s3 cp ' + zipname_with_ext + ' s3://' + s3bucketname, shell=True)

# Delete zipped file
print 'Deleting zipped file...'
os.remove(zipname_with_ext)

# Delete temp folder
print 'Deleting temp folder...'
shutil.rmtree(dirname)
