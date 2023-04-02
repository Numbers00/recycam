from bs4 import BeautifulSoup
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
    for li in ul.find_all('li'):
        # Extract the name and URL of the item
        print('a', li.find('a'))
        item_name = li.find('a').text.strip()
        item_url = 'https://www.world.org' + li.find('a')['href'].replace('..', '')

        # Make a request to the item URL
        def get_item_response():
            return requests.get(item_url)

        item_response = retry(get_item_response)
        time.sleep(5)
        item_soup = BeautifulSoup(item_response.content, 'html.parser')

        # Extract the option divs
        print('item_soup', item_soup.find_all('table')[1].find_all('table')[1])
        options = item_soup.find_all('table')[1].find_all('table')[1].find('ul').find_all('li')

        items.append({
            'name': item_name,
            'url': item_url,
            'options': [option.text.strip() for option in options]
        })

for i, item in enumerate(items, 1):
    print(f'{i}: {item.name}')