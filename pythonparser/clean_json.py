import csv
import json
import sys
import difflib
import os
import re
import io

rootpath = './json/'
initial_json_file_path = './json/name_associative_dictionnary.json'
final_dict = {}

with open(initial_json_file_path, 'r', encoding='utf8') as data_file:
    data = json.load(data_file)
    print('json_loaded')
    # print(data)
    for country in data.items():
        # print(country)
        # print(data['France'].items())
        # for object in country:
        print(type(country[1]))
        for guy_name,girl_name in country[1].items():
            try:
                if len(guy_name) > 3:
                    final_dict[guy_name.capitalize()] = girl_name.capitalize()
            except:
               pass

with io.open('./json/name_associative_dictionnary_filtered.js', 'w', encoding='utf8') as jsonfile:
    json.dump(final_dict, jsonfile, ensure_ascii=False)