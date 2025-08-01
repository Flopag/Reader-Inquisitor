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
   1. This time is set by the user
2. Look to each user goodreads account
3. If the user have red, give it a green "gommette", if not, give it a red "gommette"
   1. Before the red "gommette" is given, it will wait X time the user to log its reading.
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

Punishement come from red "gommettes"

- Punishment could be random from a list
- Punishment resolution could be verified

## Raward

Reward come from green "gommette". There is a shop that permit to buy thing using green "gommette".

## Users

There are three types of users:
- Admin: basic users management
- Maintainer: application management
- Basic: no management
- Bot: power user that have access to all users data

The users are identified using their discord account on the website, using a Discord SSO.