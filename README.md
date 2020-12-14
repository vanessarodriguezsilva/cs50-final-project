# Sign Language
CS50 Final Project - Sign Language 2020

![Image of Signs](https://image.freepik.com/free-vector/hand-drawn-sign-language-alphabet_23-2147869790.jpg)

The project is a webpage where the people can learn and practice sign language. The implementation is fairly simple, to keep the project scope in check.

Technologies and Frameworks used:

- Python
- CS50
- Flask
- Flask-Session
- requests
- sqlite3
- JQuery
- Bootstrap


## How it works?

The idea is simple. The user can read and watch all web's info without login, and to do practice and take a quiz, they will need to register or login on the webpage. During registration you need to enter these fields:

- Email
- Password: it is checked to match, must be at least 8 symbols long, that needs include an uppercase, an lowercase and a number as minimun. Then it is hashed after checks are done.

The idea to have an account is save your highest score and motive you to practice.


### Practice
This section was thought to the user learn in a interactive way the sign alphabet. All that they just need to do is press a key on theirs keyboard and the screen will show them a sign for that letter or an mistake error if they pressed a no letter key.


### Quiz
This section was thought to the user check their knowledge on sign alphabet. This consist on a quick test of 5 questions that are randomly picked from a questions array. 

Once the user took the quiz, their current score is compared with the score that they got on the test and the highest score will keep on the database.


### Routing and Sessions

Each route checks if the user is authenticated and return the answer. It means if correct mail and password were supplied and what role it has. So for example if you are not login you cannot enter /quiz or /practice route. 


### Database

Database stores all users (user, password, score) and signs (video, letter, type, key). The users table, keep all related with the users and signs table, keep all info about the sign alphabet.


## How to launch application

1. Check that you have all dependencies
  >
  ```
  $ pip install cs50
  $ pip install Flask
  $ pip install Flask-Session
  $ pip install requests
  ```
  ---
2. Clone the code: `git clone https://github.com/vanessarodriguezsilva/cs50-final-project.git`
3. Execute `cd cs50-final-project` to change into (i.e., open) that directory.
4. Once installed run command `python application.py`
5. In your browser go to `127.0.0.1:5000`
6. You are ready to go! :+1:

# Credits
All text info about the signs was taken from [this blog](https://blog.ai-media.tv/blog/7-reasons-sign-language-is-awesome), the images used was taken from [logo reference](https://cdn.iconscout.com/icon/free/png-512/sign-language-1427641-1207032.png), [signs](https://image.freepik.com/free-vector/hand-drawn-sign-language-alphabet_23-2147869790.jpg) and [videos](https://www.youtube.com/channel/UCVcQH8A634mauPrGbWs7QlQ)
