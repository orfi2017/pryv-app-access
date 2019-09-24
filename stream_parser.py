import json, requests


class StreamParser(object):
    def __init__(self, user, token):
        # structure = json.load(file)
        structure = json.loads(
            requests.get(url="https://"+user+".pryv.me/streams", params={"auth": token}).text)
        self.streams = structure['streams']
        self.annotations={}
        self.names = []

    def get_streams_names(self):
        for stream in self.streams:
            self.process_stream(stream)
        return self.names

    def process_stream(self, stream):
        self.names.append(stream['name'])
        if len(stream['children']) == 0:
            return True

        children_streams = stream['children']
        for stream in children_streams:
            self.process_stream(stream)

    def get_annotations(self):
        streams = self.streams
        for stream in streams:
            stream_name = stream['name']
            sempryv_annotations = stream['clientData']['sempryv:codes']
            for ann_type in sempryv_annotations:
                self.train_data.append(stream_name + ' ' + ann_type)
                codes = ''
                for annotation in sempryv_annotations[ann_type]:
                    codes += self.ontology_names[annotation['system_name']] + ':' + annotation['code'] + '_'
