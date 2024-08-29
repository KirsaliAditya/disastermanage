import requests
import re
from bs4 import BeautifulSoup as bs

def get_json(topic, count = 30):
    url = "https://toifeeds.indiatimes.com/treact/feeds/toi/web/show/topic"
    params = {
        "path": f"/topic/{topic}/news",
        "row": count,
        "curpg": 3
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        return None

def get_content(url):
    response = requests.get(url)
    if response.status_code != 200:
        return None
    
    soup = bs(response.content, 'html.parser')
    content = soup.find('div', attrs={'data-articlebody': "1"})

    time = soup.find('div', attrs={'class': "pZFl7"})
    time  = time.find_all('span')

    return [content.text if content else None, time[1].text if time else None]

def get_articles(topic, count = 30):
    data = get_json(topic, count)
    if data is None:
        return None

    articles = []
    for article in data['contentsData']['items']:

        title = article['hl']
        title = re.sub(r'<\/?i.*?>', '', title)

        content_time = get_content(article['wu'])
        
        articles.append({
            'title': title,
            'url': article['wu'],
            'label': topic,
            'content': content_time[0],
            'time': content_time[1]
        })

    return articles

# print(get_articles('cloudburst', 5))