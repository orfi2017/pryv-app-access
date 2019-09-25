#!flask/bin/python

import sys

from flask import Flask, render_template, request, redirect, Response
import requests as req
import json
from stream_parser import StreamParser

app = Flask(__name__)


@app.route('/')
def main():
    # serve index template
    # return render_template('index.html')
    return render_template('index_permissions.html')


@app.route('/access', methods=['POST'])
def worker():
    # read json + reply
    data = request.get_json()
    print('data')
    stream_parser = StreamParser(user=data['username'], token=data['token'])
    annotations = stream_parser.get_annotations()
    result = ''

    return result


if __name__ == '__main__':
    # run!
    app.run(host='127.0.0.1', ssl_context='adhoc')
