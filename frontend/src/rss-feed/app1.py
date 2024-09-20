from flask import Flask, jsonify
from flask_cors import CORS
import feedparser
from textblob import TextBlob

# Initialize the Flask app and enable CORS
app = Flask(__name__)
#CORS(app)
#from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})


# List of multiple RSS feed URLs
rss_urls = [


    'https://www.news18.com/commonfeeds/v1/eng/rss/india.xml',
    'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    'https://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
    'https://zeenews.india.com/rss/india-national-news.xml',
    'https://zeenews.india.com/rss/science-environment-news.xml',
    'https://zeenews.india.com/rss/india-news.xml',
    'https://feeds.feedburner.com/ndtvnews-india-news',
   
]

# Expanded list of disaster-related keywords
disaster_keywords = [
    "earthquake", "flood", "landslide", "cyclone", "hurricane", "tornado",
    "tsunami", "volcano", "wildfire", "drought", "storm", "avalanche",
    "explosion", "fire", "collapse", "chemical spill", "radiation leak",
    "gas leak", "oil spill", "disaster", "emergency", "evacuation",
    "crisis", "rescue operation", "relief effort", "casualties", "damage",
    "aftermath", "disruption", "pandemic", "outbreak", "epidemic",
    "contamination", "quarantine", "environmental damage",
    "ecological disaster"
]

# Additional keywords for urgency and danger
urgency_danger_keywords = [
    "urgent", "danger", "severe", "imminent", "extreme",
    "life-threatening", "hazard", "risk", "alert",
    "warning", "catastrophic"
]

def is_disaster_related(title, description):
    """Use TextBlob to filter news based on disaster-related keywords in the title and description."""
    blob_title = TextBlob(title.lower())
    blob_description = TextBlob(description.lower())
    
    # Check if any disaster keyword is found in the title or description
    disaster_related = any(keyword in blob_title for keyword in disaster_keywords) or \
                       any(keyword in blob_description for keyword in disaster_keywords)
    
    # Check if any urgency/danger keyword is found in the title or description
    urgent_danger_related = any(keyword in blob_title for keyword in urgency_danger_keywords) or \
                            any(keyword in blob_description for keyword in urgency_danger_keywords)
    
    return disaster_related and urgent_danger_related

@app.route('/rss', methods=['GET'])
def get_rss_feeds():
    """Fetch and filter RSS feeds from multiple URLs based on disaster-related and urgent/dangerous titles."""
    entries = []
    
    # Iterate over all RSS feed URLs
    for rss_url in rss_urls:
        feed = feedparser.parse(rss_url)
        for entry in feed.entries:
            title = entry.get('title', '')
            description = entry.get('description', '')

            # Ensure the entry is disaster-related and urgent/dangerous
            if is_disaster_related(title, description):
                entries.append({
                    'title': title,
                    'link': entry.link,  # Include the link
                    'description': description
                })

    # Return the filtered entries as JSON
    return jsonify({'entries': entries})

if __name__ == '__main__':
    app.run(debug=True)
