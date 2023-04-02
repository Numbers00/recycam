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
    url = 'https://www.ecomaine.org/what-can-be-recycled/recyclopedia/#!rc-cpage=wizard_material_list'
    driver.get(url)
    wait = WebDriverWait(driver, 30)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'ul[id^="page-section-rows"]')))


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
for i, ul in enumerate(soup.select('ul[id^="page-section-rows"]'), 1):
    print(f'Processing page {i}...')
    for li in ul.find_all('li', {'class': 'page-row'}):
        # Extract the name and URL of the item
        item_name = li.find('a').text.strip()
        item_url = li.find('a')['href']
        
        print(f'Processing item {item_name} at {item_url}...')

        # Make a request to the item URL
        def get_item_response():
            return requests.get(item_url)

        item_response = retry(get_item_response)
        time.sleep(5)
        item_soup = BeautifulSoup(item_response.content, 'html.parser')

        # Extract the option divs
        print('item_soup', item_soup)
        option_divs = item_soup.find_all('div', {'class': 'card page-section'})
        best_option_div, other_option_divs = option_divs[0], option_divs[1:]

        # Extract the best option
        best_option_rows = best_option_div.find_all('div', {'class': 'page-row'})
        best_option_name = best_option_rows[0].find('strong').text.strip()

        p_texts = [p.text.strip() for p in best_option_rows[1].find_all('p')]
        best_option_description = '\n'.join(p_texts)

        # Extract the information from the other options div
        other_options = []
        for option in other_option_divs:
            option_rows = option.find_all('div', {'class': 'page-row'})
            option_name = option_rows[0].find('strong').text.strip()

            p_texts = [p.text.strip() for p in option_rows[1].find_all('p')]
            option_description = '\n'.join(p_texts)

            other_options.append({
                'option_name': option_name,
                'option_description': option_description
            })

            # Append the item information to the list of items
            items.append({
                'item_name': item_name,
                'item_url': item_url,
                'best_option_name': best_option_name,
                'best_option_description': best_option_description,
                'other_options': other_options
            })

for item in items:
    print(item)
