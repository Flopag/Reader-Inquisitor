# Database

The database is of type sql.

The tables are:
- User
  - **id**
  - discord id: uint
  - role: enum (admin, maintainer, bot, basic)
  - first_connection_date: date
  - last_connection_date: date
- Gommette
  - **user_id** from User
  - **date**: date
  - color: enum (red or green)
  - is_used: bool
- Routine
  - **user_id** from user
  - **routine_id**: uint
  - hour: hour
  - action: enum (get_log)
- Log:
  - **user_id** from user
  - date: date
  - completion: int (from 0 to 100)
  - book: string (url to goodreads book)
- Punishment:
  - **user_id** from user
  - obtained_date: date
  - used_date: date
  - expiration_date: date
  - action: string (make a dish)
  - is_done: bool
- Reward:
  - **user_id** from user
  - obtained_date: date
  - used_date: date
  - expiration_date: date
  - action: string (make a dish)
  - is_done: bool