from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
import time
from dotenv import load_dotenv  # pip install python-dotenv
import os
from tqdm import tqdm

def get_tweets(user, count = 30):
    chrome_options = Options()
    load_dotenv()
    user_data_dir = os.getenv("USER_DATA_DIR")
    chrome_options.add_argument(user_data_dir)
    driver = webdriver.Chrome(options=chrome_options)
    
    driver.get(f"https://x.com/{user}")
    pbar = tqdm(total = count)

    tweets = []

    tweet_elements = WebDriverWait(driver, 10).until(
            lambda driver: driver.find_elements(By.XPATH, "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/section/div/div/div/div/div/article/div/div/div[2]/div[2]/div[2]/div")
    )
    pbar.update(len(tweet_elements))

    for tweet in tweet_elements:
        tweets.append(tweet.get_attribute("textContent"))

    while True:
        for i in range(2):
            driver.execute_script("window.scrollBy(0, 2000)")
            time.sleep(0.5)
        
        tweet_elements = WebDriverWait(driver, 10).until(
            lambda driver: driver.find_elements(By.XPATH, "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/section/div/div/div/div/div/article/div/div/div[2]/div[2]/div[2]/div")
        )

        for tweet in tweet_elements:
            tweets.append(tweet.get_attribute("textContent"))
        
        tweets = list(set(tweets))
        pbar.update(len(tweets) - pbar.n)

        if len(tweets) >= count:
            break
    
    return tweets[:count]

# print(get_tweets("Cristiano", 20))