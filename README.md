## Hall Reservation Website
Under the guidance of
## Mr. Nfon Noel NFEBE
# On 23rd March 2022.
# Submitted By
## Nouba Nyamsi Danold
The Above student is Full Stack Web Development Level 4 at Seven Advanced
Academy.
Table of Contents
## 1. Introduction
### 1.1. Purpose.
### 1.2. Scope.
### 1.3. References.
### 1.4. Overview.
## 2. The Overall Description
### 2.1. Product Perspective
### 2.2. Product Features
### 2.3. User Characteristics
### 2.4. Constraints
### 2.5. Assumptions and Dependencies
## 3. Specific Requirements
### 3.1. External Interfaces
### 3.1.1.Interfaces.
### 3.1.2.Hardware Interfaces.
### 3.1.3.Software Interface.
### 3.1.4.Communication Interface.
### 3.2. Logical Database Requirements
### 3.3. Software System Attributes
### 3.3.1. Reliability
### 3.3.2. Availability
### 3.3.3. Security
### 3.3.4. Maintainability

# 1.Introduction
# 1.1. Purpose:
The purpose of this document is to provide all necessary information to the
designer and full stack web engineer to develop a Hall Reservation Website
in which people will be able to book halls for their events depending on their
availability, hall capacity, prices and some other parameters.
# 1.2. Scope:
This project is limited only to the boundaries of halls in hotels. The project
does not take into consideration other parts of hotels like rooms etc. The
goal is to have a platform on which people can have Realtime informations
about various halls that will influence their decision making in booking a hall
for their events.
# 1.3. References
 . https://arkenea.com/srsdocumenttemplate.docx
 . https://www.hud.gov/sites/documents/DOC_15135.DOC
 . https://sandhyajane.com/wpcontent/uploads/2021/06/Functional-Requirement-DocumentPractical.pdf
 https://www.rkimball.com/what-is-logical-database-requirements/
# 1.4. Overview
The following sections of this document covers the overall description of the
product and product requirements.
## 2. The Overall Description
# 2.1. Product Perspective
When organizing an event, there is always a question of “where can I find a hall
whose capacity can support the number of guests present at the event and match
my budget”. So, this web app is built with the aim of permitting event organizers to
have informations about halls like location, availability, type of event that can be
held there, capacity and the prices (where comparing prices and capacities of
different halls will permit them to save money) all at the same place so that it can
assist them in their decisions making.
# 2.1.1 System Interfaces
The system comprises of the following parts for its proper functioning:

[Registration System]
This will be the portal through which the people representing hotels will
register and create an account for the hotel they are representing providing
documents proving they have the right to represent the hotel on this
website and the other side potential hall renters to create accounts as well.

[Search System]
This will permit Hall renters to be able to perform searches based on
parameters like Hall capacity, price, availability, location.

[Reservation System]
This system permits the hall renters to book halls. The event organizer
makes an appointment to book the hall and has a deadline of x number of
days to confirm. On confirmation, the hotel will send him an electronic
document confirming the deal sand will mark on their notice board the
event, date and time at which the hall will be occupied.


# 2.2. Product Features.

 Create account.
 Login.
 Logout.
 Update profile.
 Browse halls.
 Book halls.
 Cancel booking.
 Confirm booking.
 Basic search.
 Files upload.

# 2.3. User Characteristics.

Since this product is web based the users are required to have basic
knowledge about the internet and how to access it for them to be able to
use the product.

# 2.4. Constraints.

Some of the constraints in the development of this product are:

 The document submitted by hall owners will not necessarily be trust
worthy as we did not have means to verify the status of the person
updating the document.

 A hall agent or owner must manage at least one hall.

 A hall must be managed by one and only one hall manager.

 A hall renter may rent at least one hall.

# 2.5. Assumptions and Dependencies.

The web browser used by the user most have the latest version of
JavaScript engine.
Transfer of data from client to server and vise-versa will be done using
http protocol.
## 3. External Requirements

# 3.1. External Interface.

# 3.1.1 Interfaces.
Both parties are going to use a Frontend application as GUI (Graphical User
Interface) to be able to interact with the web app system.

# 3.1.2 Hardware Interfaces
Users will be required to use an android phone, a tablet, desktop or a laptop
that is able to connect to the internet to be able to interact with the web
app.

# 3.1.3 Software Interface.
Users will require a browser with JavaScript V8 engine as this will permit the
user to access the World Wide Web and execute JavaScript code written in
the web app.

# 3.1.4 Communication Interfaces.
The main communication channel that will be used in this web app is HTTP
protocols for communication between browser and web browser.

# 3.2 Logical Database Requirements
The diagram below shows how the database for this project should be set
up, showing all the relationships between the different entities.
This is a link to the actual SQL script that will generate the above result
HHRW_ER_MODEL.mwb

# 3.3 Software System Attributes.

# 3.3.1 Reliability
The reliability of this product will rely on the strength of the internet
connection of its users and the availability of the server in charge of
managing all incoming requests made by the website users as the website
provides real-time informations.

# 3.3.2 Availability
If the IT infrastructures supporting this website are unavailable for one
reason or another this will affect the functioning of the whole operations on
this website and so the maximum return time is totally unpredictable as it
will depend on the speed with which the maintainers will fix the problems
that causes the IT infrastructure or part of its component to go down.

# 3.3.3 Security
The website will use secure data transmission channels whenever
confidential customer informations will be included as well the website
includes a password recovery strategy for resolving forgotten password
issues and addressing account.

# 3.3.4 Maintainability
The ease with which faults on this website can be found and fixed depends
on the readiness of the engineers maintaining the system to find the faults
inside the log files address, test and make updates to the actual system. 
