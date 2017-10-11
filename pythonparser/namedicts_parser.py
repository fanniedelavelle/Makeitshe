import csv
import json
import sys
# import difflib
import os
import re
import io

def clean_csv(reader):
    dict_reader = []
    for row in reader:
        new_row = {}
        for column in row:
            if column == 'name':
                new_row[column] = row[column].strip().capitalize().replace(".", "")
            elif column == 'count' or column == 'babycount':
                new_row[column] = int(row[column].replace(".", ""))
            else:
                try:
                    new_row[column] = float(row[column].replace(",", "."))
                except:
                    pass
        dict_reader.append(new_row)
    return dict_reader

def create_dict_with_all_data():
    files_regex = re.compile('(Latin_)+(\w)+(UTF8.csv)+')
    # files_regex = re.compile('\W+')
    female_regex = re.compile('(Latin_)\w+(FemaleUTF8.csv)')
    rootpath = './filtered_dicts/'
    country_regex = 'Latin_(.*)(F|M){1}(.*)UTF8.csv'

    final_dict = {}
    final_country_dict = {}
    base_name_dict = {
        'female_count': 0,
        'male_count': 0,
        'total_count': 0,
        'female_babycount': 0,
        'male_babycount': 0,
        'total_babycount': 0
    }
    base_country_dict = {
                            'female_count': 0,
                            'male_count': 0,
                            'total_count':0,
                            'female_babycount': 0,
                            'male_babycount': 0,
                            'total_babycount': 0,
                            'number_of_names': 0,
                            'female_number_of_names': 0,
                            'male_number_of_names': 0,
                        }

    for path,name,fname in os.walk(rootpath):
        all_files = []
        for file in fname:
            if female_regex.search(file):
                sex = 'female'
            else:
                sex = 'male'
            # Foreach file
            if files_regex.search(file):
                # Check format
                if(re.search(country_regex, file)):
                    # Get country name
                    country = re.search(country_regex, file).group(1)
                    # Append country key to country file if it is not there
                    if not country in final_country_dict:
                        final_country_dict[country] = base_country_dict.copy()
                    #     Open CSV file
                    with open(rootpath+file, newline='', encoding='utf-8') as f:
                        # Convert data to dict object
                        reader = clean_csv(csv.DictReader(f,delimiter=';'))
                        # Foreach dataset
                        for row in reader:
                            if ('name' in row) and (len(row['name']) > 3):
                                dataobj = {}
                                # Increment total number of name for country
                                final_country_dict[country]['number_of_names'] += 1
                                final_country_dict[country][sex+'_number_of_names'] += 1
                                for column in row:
                                    if column != 'name':
                                        dataobj[column] = row[column]
                                # Append each stats to country stats
                                for i in dataobj:
                                    try:
                                        final_country_dict[country]['total_'+i] += dataobj[i]
                                        final_country_dict[country][sex+'_'+i] += dataobj[i]
                                    except:
                                        pass
                            # Create final dict
                                stats_dict = {}
                                stats_dict[country] = dataobj
                                if (row['name'] in final_dict) and (sex in final_dict[row['name']]) and (not country in final_dict[row['name']][sex]):
                                    newdict = {}
                                    stats_dict[country]['prison_count'] = 0
                                    newdict.update(stats_dict[country])
                                    final_dict[row['name']][sex][country] = stats_dict[country]
                                elif (row['name'] in final_dict) and (sex in final_dict[row['name']]):
                                    if final_dict[row['name']][sex][country]['prison_count'] == 0:
                                        final_dict[row['name']][sex][country]['prison_count'] += 2
                                    else:
                                        final_dict[row['name']][sex][country]['prison_count'] += 1
                                elif (row['name'] in final_dict):
                                    # newdict = []
                                    stats_dict[country]['prison_count'] = 0
                                    newdict[sex] = stats_dict
                                    final_dict[row['name']] = newdict
                                else:
                                    newdict = {}
                                    stats_dict[country]['prison_count'] = 0
                                    newdict[sex] = stats_dict
                                    final_dict[row['name']] = newdict

    for name in final_dict:
        f_country_count = len(final_dict[name]['female']) if 'female' in final_dict[name] else 0
        m_country_count = len(final_dict[name]['male']) if 'male' in final_dict[name] else 0
        final_dict[name]['female_number_of_countries'] = f_country_count
        final_dict[name]['male_number_of_countries'] = m_country_count
        final_dict[name]['number_of_countries'] = f_country_count + m_country_count
        new_stats_dict = base_name_dict.copy()
        for sex,v in final_dict[name].items():
            if sex == 'male' or sex == 'female':
                for k,country_stats in v.items():
                    for key,value in country_stats.items():
                        # print(value)
                        try:
                            new_stats_dict['total_'+key] += value
                            new_stats_dict[sex+'_'+key] += value
                            # print(new_stats_dict['total_' + i])
                        except:
                            pass
        # print(new_stats_dict)
        final_dict[name]['stats'] = new_stats_dict

    # jsonfile = open('./json/name_associative_dictionnary.json', 'w')

    with io.open('./json/name_associative_dictionnary_v2.json', 'w', encoding='utf8') as jsonfile:
        json.dump(final_dict, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)
    with io.open('./json/country_stats.json', 'w', encoding='utf8') as jsonfile:
        json.dump(final_country_dict, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)

create_dict_with_all_data()