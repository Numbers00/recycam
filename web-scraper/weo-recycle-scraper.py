from bs4 import BeautifulSoup
import csv
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def retry(func, max_attempts=5, sleep_time=5):
    for attempt in range(1, max_attempts+1):
        try:
            result = func()
            return result
        except:
            if attempt == max_attempts:
                raise
            else:
                time.sleep(sleep_time)
                print(f'Retrying {func.__name__}...')


# Set up the webdriver
def init_driver():
    return webdriver.Chrome()


driver = retry(init_driver)


# Navigate to the page
def navigate():
    url = 'https://www.world.org/weo/recycle'
    driver.get(url)


retry(navigate)

# Extract the data using BeautifulSoup
def extract_data():
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    return soup


soup = retry(extract_data)

# Close the webdriver
def close_driver():
    driver.quit()


retry(close_driver)


items = []
for i, ul in enumerate(soup.find_all('table')[1].find_all('table')[1].find('table').find_all('td'), 1):
    print(f'Processing column {i}...')

    # if (i == 2): break
    for li in ul.find_all('li'):
        # Extract the name and URL of the item
        print('a', li.find('a'))
        # item_name = li.find('a').text.strip()
        item_url = 'https://www.world.org' + li.find('a')['href'].replace('..', '')

        # Make a request to the item URL
        def get_item_response():
            return requests.get(item_url)

        # item_response = retry(get_item_response)
        
        driver = retry(init_driver)
        driver.get(item_url)
        item_soup = BeautifulSoup(driver.page_source, 'html.parser')

        options_table = item_soup.find_all('table')[1].find_all('table')[1]
        if options_table.find('a') is not None:
            option_groups = options_table.find_all('a')

            for option_group in option_groups:
                if option_group.find('ul') is None:
                    item_name = options_table.find('b').text.strip()
                    options = options_table.select('ul > li, ol > li')

                    # if (not len(options)): continue
                    print('options', options)

                    items.append({
                        'name': item_name,
                        'url': item_url,
                        'options': ';'.join([option.text.strip() for option in options])
                    })
                else:
                    item_name = option_group.find('b').text.strip()
                    options = option_group.select('ul > li, ol > li')

                    # if (not len(options)): continue
                    print('options1', options)

                    items.append({
                        'name': item_name,
                        'url': item_url,
                        'options': ';'.join([option.text.strip() for option in options])
                    })

        else:
            item_name = options_table.find('b').text.strip()
            options = options_table.select('ul > li, ol > li')

            print(len(options))
            # print('ul', len(options_table.select('ul > li')))
            for option in options:
                print(option.text.strip())

            # print('options2', [option for option in options])
            # print('options2', ';'.join([option.text.strip() for option in options]))

            items.append({
                'name': item_name,
                'url': item_url,
                'options': ';'.join([option.text.strip() for option in options])
            })

        
# Print for debugging
for i, item in enumerate(items, 1):
    print(f'{i}: {item}')

# Write the data to a CSV file
with open('items.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Name', 'URL', 'Options'])
    for item in items:
        writer.writerow([item['name'], item['url'], item['options']])
