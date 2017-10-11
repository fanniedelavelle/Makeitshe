import json
import io

rootpath = './json/'
initial_json_file_path = './json/filtered/names.json'
female = {}
male = {}
androgynous = {}
androgynous_stats = {
    'female_country_ratio': 0,
    'male_country_ratio': 0,
    'female_count_ratio': 0,
    'male_count_ratio': 0,
    'female_babycount_ratio': 0,
    'male_babycount_ratio': 0
}

def parse_countries(arr_data):
    new_country_list = []
    for country,i in arr_data.items():
        new_country_list.append(country)
    return new_country_list


def classify_androgynous(and_data):
    sex = False
    country_ratio = 0.8
    not_country_ratio = 0.51
    count_ratio = 0.8
    babycount_ratio = 0.8
    not_babycount_ratio = 0.71
    not_count_ratio = 0.51
    if ((and_data['female_country_ratio'] >= country_ratio) or (and_data['female_babycount_ratio'] >= babycount_ratio) or (
        and_data['female_count_ratio'] >= count_ratio)) and (
            (and_data['male_country_ratio'] < not_country_ratio) and (and_data['male_babycount_ratio'] < not_babycount_ratio) and (
        and_data['male_count_ratio'] < not_count_ratio)):
        sex = 'female'

    elif (and_data['male_country_ratio'] >= country_ratio) or (and_data['male_babycount_ratio'] >= babycount_ratio) or (
        and_data['male_count_ratio'] >= count_ratio) and (
            (and_data['female_country_ratio'] < not_country_ratio) and (and_data['female_babycount_ratio'] < not_babycount_ratio) and (
        and_data['female_count_ratio'] < not_count_ratio)):
        sex = 'male'

    return sex

# Create gendered dictionnairies and pops out no longer needed male/female stats
with open(initial_json_file_path, 'r', encoding='utf8') as data_file:
    data = json.load(data_file, parse_int=int)
    # print(data)
    for name,obj in data.items():
        if 'is_female' in obj:
            if len(name) > 3 and 'female' in obj and (len(obj['female']) > 6 or obj['stats']['female_count'] > 20000):
                if 'stats' in obj:
                    obj['count'] = obj['stats']['female_count']
                    obj['babycount'] = obj['stats']['female_babycount']
                    del obj['stats']
                    del obj['female_number_of_countries']
                    del obj['male_number_of_countries']
                    del obj['number_of_countries']
                if 'female' in obj:
                    obj['countries'] = parse_countries(obj['female'])
                else:
                    obj['countries'] = ['USA']
                if 'male' in obj:
                    del obj['male']
                if 'female' in obj:
                    del obj['female']
                female[name] = obj
            continue
        elif 'is_male' in obj:
            if 'stats' in obj:
                obj['count'] = obj['stats']['male_count']
                obj['babycount'] = obj['stats']['male_babycount']
                del obj['stats']
                del obj['female_number_of_countries']
                del obj['male_number_of_countries']
                del obj['number_of_countries']
            if 'male' in obj:
                obj['countries'] = parse_countries(obj['male'])
            else:
                obj['countries'] = ['USA']
            if 'male' in obj:
                del obj['male']
            if 'female' in obj:
                del obj['female']
            male[name] = obj
            continue

        if(obj['female_number_of_countries']) and (obj['male_number_of_countries']):
            and_data = androgynous_stats.copy()
            and_data['female_country_ratio'] = round(obj["female_number_of_countries"] / obj["number_of_countries"], 3)
            and_data['male_country_ratio'] = round(obj["male_number_of_countries"] / obj["number_of_countries"], 3)
            if (obj['stats']['female_count'] > 0) and (obj['stats']['male_count'] > 0):
                and_data['female_count_ratio'] = round(obj['stats']["female_count"] / obj['stats']["total_count"], 3)
                and_data['male_count_ratio'] = round(obj['stats']["male_count"] / obj['stats']["total_count"], 3)
            if (obj['stats']['female_babycount'] > 0) and (obj['stats']['male_babycount'] > 0) :
                and_data['female_babycount_ratio'] = round(obj['stats']["female_babycount"] / obj['stats']["total_babycount"], 3)
                and_data['male_babycount_ratio'] = round(obj['stats']["male_babycount"] / obj['stats']["total_babycount"], 3)
            # obj.update(and_data)

            androgynous[name] = and_data
            # Check if name is significantly more common in one gender
            sex = classify_androgynous(and_data)
            if sex:
                obj['countries'] = parse_countries(obj[sex])
                obj['count'] = obj['stats'][sex+'_count']
                obj['babycount'] = obj['stats'][sex+'_babycount']
                if 'stats' in obj:
                    del obj['stats']
                    del obj['female_number_of_countries']
                    del obj['male_number_of_countries']
                    del obj['number_of_countries']
                    del obj['male']
                    del obj['female']
                androgynous[name]['added_to_'+sex] = 1
                locals()[sex][name] = obj
        elif obj['female_number_of_countries']:
            obj['count'] = obj['stats']['female_count']
            obj['babycount'] = obj['stats']['female_babycount']
            if 'stats' in obj:
                del obj['stats']
                del obj['female_number_of_countries']
                del obj['male_number_of_countries']
                del obj['number_of_countries']
            obj['countries'] = parse_countries(obj['female'])
            if 'female' in obj:
                del obj['female']
            if 'male' in obj:
                del obj['male']
            if len(obj['countries']) >= 8 or obj['count'] >= 10000:
                female[name] = obj
        elif obj['male_number_of_countries']:
            obj['count'] = obj['stats']['male_count']
            obj['babycount'] = obj['stats']['male_babycount']
            if 'stats' in obj:
                del obj['stats']
                del obj['female_number_of_countries']
                del obj['male_number_of_countries']
                del obj['number_of_countries']
            obj['countries'] = parse_countries(obj['male'])
            if 'male' in obj:
                del obj['male']
            if 'female' in obj:
                del obj['female']
            male[name] = obj

# Removes too samples that are too small from the androgynous dict

with io.open('./json/filtered/males.json', 'w', encoding='utf8') as jsonfile:
    json.dump(male, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)

with io.open('./json/filtered/females.json', 'w', encoding='utf8') as jsonfile:
    json.dump(female, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)

with io.open('./json/filtered/androgynous.json', 'w', encoding='utf8') as jsonfile:
    json.dump(androgynous, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)