# Requirements

## Basics

The application must automate the "republique des Gommettes" rules:
- Each day:
  - One Green "gommette" is earn when the person reads during the day
  - One Red "gommette" is earn when the person do not read during the day
- After a certain number of "gommettes" (for example: 5), the person will have a punishment (for example: make a dish)

## Routine

When someone reads, it update the advancement of the book on its [goodreads](https://www.goodreads.com/) account. The application will:
1. Wait the time of the day or night (for example 3AM)
2. Look to each user goodreads account
3. If the user have red, give it a green "gommette", if not, give it a red "gommette"
4. If needed, make notification

## Information to get from users

The application will take track of some statistics, it will need to get:
- The number of pages red on each day
- The date of completion of each book

These statistic could be used to rank peoples.

## Discord Bot

A discord bot will annouce:
- If someone get a punishment
- If someone have resolves its punishment
- If someone is on a streak
- If some one make a break or give up

The discord bot could also say some random stat about someone.

## Punishments

- Punishment could be random from a list
- Punishment resolution could be verified

## Users

There are three types of users:
- Admin: basic users management
- Maintainer: application management
- Basic: no management

The users are identified using their discord account on the website, using a Discord SSO.