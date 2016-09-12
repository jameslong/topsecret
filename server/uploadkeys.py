#
# Script to upload game keys to db
#

import sys
import boto3
from progress.bar import Bar
from time import sleep

filename = sys.argv[1]
tablename = sys.argv[2]
print 'Uploading keys from ' + filename + ' to ' + tablename

with open(filename) as f:
    keys = [line.rstrip('\n') for line in open(filename)]

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(tablename)

def to_key_item(key):
    return {
        'gameKey': key
    }

key_items = map(to_key_item, keys)
key_items_len = len(key_items)

delay = 0.1 # Interval between item uploads, used to avoid exceeding provisioned throughput

bar = Bar('Processing', max=key_items_len)
for item in key_items:
    table.put_item(Item=item)
    sleep(delay)
    bar.next()
bar.finish()

print "Success!"
