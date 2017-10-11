import csv
import json
import sys
import difflib
import os
import re
import io

rootpath = './json/'
json_path = rootpath+'name_associative_dictionnary_v2.json'
gendered_json_path = rootpath+'/gender.json'


with open(json_path, encoding='utf-8') as json_file:
    json_data = json.load(json_file)
    json_keys = json_data.keys()

with open(gendered_json_path, encoding='utf-8') as json_gender:
    gender_data = json.load(json_gender)
    gender_keys = gender_data.keys()

for key in gender_keys:
    if key in json_keys:
        if gender_data[key] == 'F':
            if not 'female' in json_data[key]:
                json_data[key]['female'] = {}
            if not 'USA' in json_data[key]['female']:
                json_data[key]['female']['USA'] = {}
                if 'female_number_of_countries' in json_data[key]:
                    json_data[key]['number_of_countries'] += 1
                    json_data[key]['female_number_of_countries'] += 1
            json_data[key]['is_female'] = True
        elif gender_data[key] == 'M':
            if not 'male' in json_data[key]:
                json_data[key]['male'] = {}
            if not 'USA' in json_data[key]['male']:
                json_data[key]['male']['USA'] = {}
                if 'male_number_of_countries' in json_data[key]:
                    json_data[key]['number_of_countries'] += 1
                    json_data[key]['male_number_of_countries'] += 1
            json_data[key]['is_male'] = True
    else:
        newdict = {}
        if len(key) > 3:
            if gender_data[key] == 'F':
                newdict = { 'is_female':True }
            elif gender_data[key] == 'M':
                newdict = {'is_male': True}
            json_data[key] = newdict

with io.open(json_path, 'w', encoding='utf8') as jsonfile:
    json.dump(json_data, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)

