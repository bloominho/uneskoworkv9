# Unesko Work

Unesko Work is a tool developed and used by Insight Edu Inc. This program is developed to manage questions from our students smarter. It keeps a live record of questions that students have left at the online Q&A board and informs the TAs which questions are waiting to be answered.

Tools used: Javascript (Node.js and React), Web Crawler, GCP, Firebase Firestore

## Motivation

The development of this system was motivated my a simple prolblem in the original Q&A board. 

**How did the original Q&A board work?**

1. A student leaves their question as a post in the online Q&A board.
2. The question is marked as 'waiting'.
3. TAs would choose a question that is marked 'waiting' and starts answering it.
4. While the TA is answering the question, it is left 'waiting'.
5. When the TA finishes answering it, it is now marked 'answered'.

The problem of this system is that there are only two statuses for the questions - waiting and answered. Therefore, a question that is being answered by a TA is left as 'waiting' until he/she finished answering it. This allows another TA to start answering the same quesiton while there's already someone answering it.

![Problem of the original Q&A board](/img/Picture1.png)

This is a problem becuase each question needs only one answer. All other answers except the first one are useless - the TAs worked for nothing. Therefore, it is important to keep TAs from answering a question that is already being answered by someone else.

## Goal

There are several goals of this system.

### 1. Keep a live status of questions

The system manages a database that stores the questions and their status. When a new question is posted on the Q&A board, it is automatically added to the database. When a TA starts answering it, its status at the database is modified. When it is answered, its status is again modified. As a result, the database keeps a live track of the questions' status.

### 2. Keep a record of TAs works

To ensure that all TAs share a similar workload, the system must keep how much work each TA has done. Similar to how this system keeps a record of questions, it also keeps a record of how much work(Number of Questions, Time they spent for each question) each TA has done.

### 3. A frontend UI that gives an easy way to access&modify the database

A list of questions that are left unanswered must be given to the TAs. It must be possible for the TAs to choose a question and state that they are working on it. This process must be easy with a website with nice UI.


## System Structure

![Image of the System Structure](/img/Picture2.png)

### 1. Web Crawler

The original online Q&A board's database cannot be accessed directly but only through its website. Therefore, a crawler is needed to access, read and save the questions at the database.

This crawler tries to read new questions every 3 minutes by repeating the following process.

1. Access the database, figure out the latest question saved at the database.
2. Access the Q&A board, figure out whether there is any new questions that aren't yet saved at the database.
3. If any, read the question data and save it at the database one by one.

The crawler is developed using node-js, puppeteer and headless chromium. The program opens a headless chromium browser every 3 minutes and accesses the online Q&A board and the database. In order to make is more stable, the forever library (a Node.js process manager) is used to keep the crawler running.

Finally, this crawler is run on a Google Cloud Platform server.

### 2. Database

The database must keep a live record of the questions. It stores questions' data as following.

1. Question Title
2. ID of the question at the Q&A board
3. Name of the student that wrote the question
4. Date & Time the question was posted
5. Status (Waiting / Answering / Finished)
6. TA that worked / is working on the question
7. Date & Time the TA started to answer it
8. Date & Time the TA finished answering it

All data this system needs is stored in this single database table. 

- When the website asks a list of questions that are waiting an answer, a query that filters 'Status == Waiting' is used.

- When the website asks whether a TA is working on a question, a query that filters 'Status == Answering && TA == him/her' is used

- When the website asks a list of questions a TA has done, a query that filters 'TA == him/her' is used. 

This database is developed/operated based on Firebase Firestore.

### 3. Website

The website must allow TAs to access the database easily. The website is composed of two modes - normal mode and administrative mode.

**Normal Mode**

Most TAs access the normal mode. The following figure shows its flow chart.

![Normal Mode Flow Chart](/img/Picture3.png)

1. The TA signs in to the system
2. When the TA isn't working for any question, the website shows the list of questions that are waiting to be answered. 
3. When the TA selects a question and clicks on it, the website modifies the database (so that it is marked as 'answering'), and displays the data of the question to the TA.
4. When the TA finishes answering the question, it is marked 'answered' at the database and the website now shows the waiting list again (repeats 2~4).

It is important that the waiting questions list is updated live. To do this, the webpage is connected to the database via snapshot, which is supported by firebase firestore. Whenever the database is updated, the client webpage automatically reflects the change. 

To ensure no question is answered by multiple TAs, the website checks the database whenever a TA attemps to start answering for a question. (1) Check whether it is waiting and (2) Mark answering is done atomically. This adds another layer of safety.

**Administrative Mode**

The administrative view gives full access to the database. While the normal view allows TAs to see the list of waiting questions and the question they are answering only, the administrative mode allows the users to see all questions and other TA's data. This mode can be accessed by administrators only. 

- List of All Questions and their status
- Change the status of each question (waiting/answering <-> answered)
- See how much work each TA has done (how many questions the TA has answered, how much time each question took)

## Data Security

The databse is controled securely by adapting access rules.

![Auth Chart](/img/Picture4.png)

## Stability
This program was first developed in April 2020. Since then it was continuously developed and now this is the 9th version. 

This 9th version has been run since 2022 and did not fail (making database error, system failure... anything that might be considered malfuntion) until now (Aug 2025).

## Credits
Developed by Andrew I. Park