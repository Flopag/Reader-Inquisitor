import requests
from bs4 import BeautifulSoup

fooling_goodreads_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

url = "http://localhost:4000"
password = "thisisaverysecurepass"

users_pages = []

session = requests.Session() 

print("Connection to the backend...")

session.get(url + "/auth/power_user?pass=" + password)

if(not session.get(url + "/users/").json()["success"]):
    print("> Connection refused")
    exit(1)

print("> Connected!")

print("Get all active users html pages...")

active_users = session.get(url + "/users/active").json()["data"]

if(not active_users):
    print("> Cannot get active users")
    exit(1)

new_logs = []

for user in active_users:
    user_id = user["user_id"]
    user_url = user["user_url"]
    user_logs = []

    soup = BeautifulSoup(requests.get(user_url, headers=fooling_goodreads_headers).text, 'html.parser')
    log_htmls = soup.select('#currentlyReadingReviews > div.Updates > div.secondcol')

    for log_html in log_htmls:
        log_value = log_html.find_all("a", onclick=True)[0].contents[0]
        log_book_link = log_html.select_one('div.secondcol-top > div.whos-review > div:nth-child(2) > a')["href"]

        if(log_value.split(" ")[0] == "(page"):
            log_value = int(log_value.split(" ")[1]) / int(log_value.split(" ")[3].split(")")[0])
            log_value *= 100
            log_value = round(log_value)
        else:
            log_value = int(log_value.split("(")[1].split("%")[0])

        log_book_id = log_book_link

        user_logs += [(log_value, log_book_id)]

    new_logs += [(user_id, user_logs)]

print("> " + str(new_logs))

print("Updating the database...")

req = session.get(url + "/books").json()

if(not req["success"]):
    print("> Cannot get books")
    exit(1)

books = req["data"]

for new_log in new_logs:
    user_id = new_log[0]
    user_logs = new_log[1]
    has_read = False

    for user_log in user_logs:
        completion = user_log[0]
        book_url = "https://www.goodreads.com" + user_log[1]

        book_id = None

        # Get book if exist
        for book in books:
            if(book["book_reference_url"] == book_url):
                book_id = book["book_id"]
        
        if(not book_id):
            res = session.post(url + "/books", json={"goodreads_url": book_url}).json()

            if(not req["success"]):
                print("> Cannot create book")
                exit(1)
            
            book_id = res["data"]["book_id"]

        res = session.post(url + "/logs", json={
            "book_id": book_id, 
            "completion": completion,
            "usurpation": user_id
            }).json()
        
        if(res["success"]):
            has_read = True

    if(has_read):
        print("> Green gommette attributed to " + str(user_id))
        session.post(url + "/gommettes/green", json={"usurpation": user_id}).json()
    else:
        print("> Red gommette attributed to " + str(user_id))
        session.post(url + "/gommettes/red", json={"usurpation": user_id}).json()

