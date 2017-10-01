import csv
import json
import sys
import difflib
import os
import re
import io

files_regex = re.compile('(Latin_)+(\w)+(UTF8.csv)+')
# files_regex = re.compile('\W+')
female_regex = re.compile('(Latin_)\w+(FemaleUTF8.csv)')
rootpath = './dictionnary/'
country_regex = 'Latin_(.*)FemaleUTF8.csv'

final_dict = { 'USA':{}, 'France':{}, 'Germany':{}, 'Greece':{} }
for path,name,fname in os.walk(rootpath):
    all_files = []
    # use re.sub to get middle string
    for file in fname:
        if files_regex.search(file) and female_regex.search(file):
            i = 0
            try:
                male_file = rootpath+file.replace('Female', 'Male')

                with open(male_file, newline='', encoding='utf-8') as f:
                    malereader = csv.reader(f)
                    list_male = [row[0].split(';')[0].strip().capitalize() for row in malereader]
                country = re.search(country_regex, file).group(1)
                country_dict = {}
                i = 0
                with open(rootpath+file, newline='', encoding='utf-8') as f:
                    csvfilereader = csv.reader(f)
                    for frow in csvfilereader:
                        splitted_frow = frow[0].split(';')[0].strip().capitalize()
                        matches = difflib.get_close_matches(splitted_frow, list_male, n=1, cutoff=0.3)
                        if len(matches) > 0:
                            if(matches[0] != splitted_frow):
                                country_dict[matches[0].strip()] = splitted_frow
                                print(matches[0] + ' ' + splitted_frow)
                        else:
                            country_dict[list_male[i]] = splitted_frow
                            i += 1
                print('--------------------- appended '+country+' to list -----------------')
                final_dict[country] = country_dict
            except:
                print('no male dic counterpart for '+file)
                print(sys.exc_info()[0])
                raise

# jsonfile = open('./json/name_associative_dictionnary.json', 'w')

with io.open('./json/name_associative_dictionnary.json', 'w', encoding='utf8') as jsonfile:
    json.dump(final_dict, jsonfile, ensure_ascii=False)