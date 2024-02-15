<!-- PASSWORD REQUIREMENTS:
At least one digit [0-9]
At least one lowercase character [a-z]
At least one uppercase character [A-Z]
At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
At least 8 characters in length, but no more than 32. -->

*TODO 1*
- Create a functionality to reset password.  [CHECK!][.......possibly a field for old password.]
- Show user's name on the navigation bar.[CHECK]
- While trying to login user in, show a loading page.[][.....may or may not work on...]
- Create an account section for user to view their information and change their password.
(....Accounts....)
1) Update password.
[...Create layout for password.
..Update password on DB, and send email to user. Possibly use] [CHECK!]
2) **Update email**[CHECK!]
[..Now have to create the layout for updating email.
    ..Check if email exisits in the system. If it does. Let user know "This is your current email. Please choose a new email address"
    ..Check if email is in the valid format. 
    .. Check if email is not empty.
    .. Email is not a number.
    .. Once email is verified. Alert user. Email user that their email has been changed or updated. Refresh the page.]
3) **Update name**[CHECK!]


*TODO 2*
- Create Schema for the add todo list. Should be able to add the User schema as well.[CHECK!]
    - Description:string
    - priority: [Low, High]
    - isImportant:boolean
    - isChecked: boolean
    - userID
    - Reminder date
    - reminder time
    - repeat: String, options: [Never, Daily, weekdays, weekends, monthly, yearly]
    - repeatEndDate: Date
    - ref:user

-----[CHECK!]------


- Add the form component to be able to add a to do list.[CHECK!]

- Should contain a save button, delete button.[CHECK!](Delete button was more like a checkbox)

--ALL NOTES--
    - Working on checkbox [CHECK!]
    - Work on adding the markASIMPORTANT button in the home page if wasn't marked as important.[CHECK!]
        - Onclick, call the update api to dynamically update the page, mark that note as important. And refresh the page.[CHECK!]
    - customize loading screen [CHECK!]
-----[CHECK!]------


--SIDE BAR NAVIGATION--
    - Update the length of all notes, important note.[CHECK!]
    - Onlick of the Inbox and Important icon, display the notes that go with the filter.[CHECK!]
    - Layout should be same as home page. [CHECK!]


----WORK ON NOTIFICATION---
    - Create a reminder data base
     - pastDue: boolean
     - dueToday: boolean
     - dueTomorrow: boolean

----WORK ON FILTERING------
    - Filter by Dates
    - Filter b



