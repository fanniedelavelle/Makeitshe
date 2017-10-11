import csv
import json
import sys
# import difflib
import os
import re
import io

rootpath = './filtered_dicts/'
files = {'female':'Latin_QuebecFemaleUTF8.csv', 'male':'Latin_QuebecMaleUTF8.csv'}
writeToFiles = {'female':'Latin_Quebec2FemaleUTF8.csv', 'male':'Latin_Quebec2MaleUTF8.csv'}
female_dict = []
male_dict = []

for key,file in files.items():
    with open(rootpath+file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            if ('name' in row) and (len(row['name']) > 3):
                babycount = 0
                for column in row:
                    if column != 'name':
                        babycount += int(row[column])

                if babycount > 500:
                    if key == 'female':
                        female_dict.append({'name': row['name'], 'babycount':babycount})
                    elif key == 'male':
                        male_dict.append({'name': row['name'], 'babycount': babycount})

for key,file in writeToFiles.items():
    with open(rootpath+file, 'w+', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, delimiter=';', fieldnames=['name', 'babycount'])
        writer.writeheader()
        if key == 'female':
            for obj in female_dict:
                writer.writerow(obj)
        elif key == 'male':
            for obj in male_dict:
                writer.writerow(obj)
