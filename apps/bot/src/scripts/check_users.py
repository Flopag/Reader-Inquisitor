import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta
import json
import os 

# Initiate connection with backend

fooling_goodreads_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

url = os.getenv("BACKEND_URL")
password = os.getenv("POWER_USER_PASS")

session = requests.Session() 

session.get(url + "/auth/power_user?pass=" + password)

if(not session.get(url + "/users/").json()["success"]):
    print("> Connection refused")
    exit(1)

# --------

res = session.get(url + "/users/active").json()

if(not res["success"]):
    print(f'> Cannot get actives users: {res["message"]}')
    exit(1)

active_users = res["data"]

attribution = []

for user in active_users:
    user_id = user["user_id"]

    # Transform goodreads logs into ours
    goodreads_url = user["user_url"]
    if(goodreads_url):
        goodreads_logs = []

        soup = BeautifulSoup(requests.get(goodreads_url, headers=fooling_goodreads_headers).text, 'html.parser')
        log_htmls = soup.select('#currentlyReadingReviews > div.Updates > div.secondcol')

        # Get Current goodreads logs
        for log_html in log_htmls:
            log_value = log_html.find_all("a", onclick=True)[0].contents[0]
            log_book_link = log_html.select_one('div.secondcol-top > div.whos-review > div:nth-child(2) > a')["href"]

            if(log_value.split(" ")[0] == "(page"):
                log_value = int(log_value.split(" ")[1]) / int(log_value.split(" ")[3].split(")")[0])
                log_value *= 100
            else:
                log_value = int(log_value.split("(")[1].split("%")[0])

            log_book_id = log_book_link

            goodreads_logs += [(log_value, log_book_id)]
        # Goodreads logs -> Ours
        for log in goodreads_logs:
            value = log[0]
            book_url = "https://www.goodreads.com" + log[1]

            res = session.get(url + f'/books/by_goodreads?goodreads_url={book_url}').json()
            book = res["data"]


            # Create books that does not exist
            if(not res["success"]):
                res = session.post(url + "/books", json={"goodreads_url": book_url}).json()

                if(not res["success"]):
                    print(f'> Cannot create book: {res["message"]}')
                    exit(1)

                book = res["data"]
            session.post(url + "/logs", json={
                    "book_id": book["book_id"], 
                    "completion": value,
                    "usurpation": user_id
                }).json()
    # --------

    # Verify if the user has read
    res = session.get(url + f'/logs/last?usurpation={user_id}').json()

    last_user_log = res["data"]

    logged_at = None
    if(last_user_log):
        logged_at = datetime.fromisoformat(last_user_log['logged_at'].replace("Z", "+00:00"))

    last_check = None

    res = session.get(url + f'/bot/check_users/log').json()

    if(res["success"]):
        last_bot_log = res["data"]
        last_check = datetime.fromisoformat(last_bot_log["assigned_date"].replace("Z", "+00:00"))

    if((logged_at and last_check and logged_at > last_check) or (logged_at and not last_check)):
        res = session.get(url + f'/books/{last_user_log["book_id"]}').json()

        attribution += [{
            "user": user,
            "book": res["data"] if res["success"] else None,
            "book_id": last_user_log["book_id"] if not res["success"] else None,
            "gommette": "green"
        }]
    else:
        attribution += [{
            "user_id": user["user_id"],
            "gommette": "red"
        }]

print(attribution)