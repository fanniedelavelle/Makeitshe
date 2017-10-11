import json
import io

rootpath = './json/'
initial_json_file_path = './json/name_associative_dictionnary_v2.json'
words_to_remove_path = './englishnames/commonnouns.txt'
results = {}

def read_words(words_file):
    return [word.capitalize() for line in open(words_file, 'r') for word in line.split()]

word_list = read_words(words_to_remove_path)
print(word_list)
with open(initial_json_file_path, 'r', encoding='utf8') as data_file:
    data = json.load(data_file, parse_int=int)
    for name,obj in data.items():
        if not name in word_list:
            if ('is_female' in obj) or ('is_male' in obj):
                results[name] = obj
            elif(obj['number_of_countries'] > 4):
                results[name] = obj
            elif(obj['stats']['total_count'] > 999) or (obj['stats']['total_babycount'] > 50):
                results[name] = obj

with io.open('./json/filtered/names.json', 'w', encoding='utf8') as jsonfile:
    json.dump(results, jsonfile, ensure_ascii=False, sort_keys=True, indent=2)