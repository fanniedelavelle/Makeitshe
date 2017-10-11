import csv
import json
import sys
import difflib
import os
import re
import io

rootpath = './json/filtered/'
male_file_path = rootpath+'males.json'
female_file_path = rootpath+'females.json'
keys_to_add_path = './englishnames/keystoadd.csv'
final_dict = {}
not_matched = {}

with open(male_file_path, encoding='utf-8') as male_file:
    male_data = json.load(male_file)
    male_keys = male_data.keys()

with open(female_file_path, encoding='utf-8') as female_file:
    female_data = json.load(female_file)
    female_keys = female_data.keys()

i = 0
multiple_matches = 0
no_matches = 0
# for key, value in male_data.items():
#     i += 1
#     matches = difflib.get_close_matches(key, female_keys, n=5, cutoff=0.5)
#
#     if(len(matches) <= 0 ):
#         no_matches += 1

i = 0
no_matches = 0

for key in male_keys:
    i+= 1
    matches = difflib.get_close_matches(key, female_keys, n=3, cutoff=0.6)
    for fname in matches:
        iset = set(female_data[fname]['countries']).intersection(male_data[key]['countries'])
        if len(iset) >= 1:
            final_dict[key] = fname
            break
    if not key in final_dict:
        if len(matches) >= 1:
            final_dict[key] = matches[0]
        else:
            matches = difflib.get_close_matches(key, female_keys, n=3, cutoff=0.3)
            if(len(matches)):
                final_dict[key] = matches[0]
            else:
                not_matched[key] = key
    print(i)

with open(keys_to_add_path, newline='', encoding='utf-8') as f:
    # Convert data to dict object
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        final_dict[row['name']] = row['associate']

with io.open('./json/final/associative.json', 'w', encoding='utf8') as jsonfile:
    json.dump(final_dict, jsonfile, ensure_ascii=False)

with io.open('./json/final/not_matched.json', 'w', encoding='utf8') as jsonfile:
    json.dump(not_matched, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)


print('no matches:')
print(no_matches)
print('multiple matches:')
print(multiple_matches)

