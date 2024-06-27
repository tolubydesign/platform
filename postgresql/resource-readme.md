# Resources

## References

[Postgres with Docker and Docker compose a step-by-step guide for beginners](https://geshan.com.np/blog/2021/12/docker-postgres/)

[postgres](https://hub.docker.com/_/postgres)

Store files: [31.7. Storing Binary Data](https://www.postgresql.org/docs/7.4/jdbc-binary-data.html)

## Research

_CHAR and VARCHAR are implemented exactly the same in Postgres (and Oracle). There is no difference in speed when using those data types._

_However, there is one difference that can make a difference in performance: a char column is always padded to the defined length. So if you define a column as char(100) and one as varchar(100) but only store 10 characters in each, the char(100) column uses 100 characters for each value (the 10 characters you stored, plus 90 spaces), whereas the varchar column only stores 10 characters._

[Index performance for CHAR vs VARCHAR (Postgres)](https://dba.stackexchange.com/questions/126003/index-performance-for-char-vs-varchar-postgres)

___

_Associated with each user name is a user identification number (UID). The UID number identifies the user name to any system on which the user attempts to log in. And, the UID number is used by systems to identify the owners of files and directories. If you create user accounts for a single individual on a number of different systems, always use the same user name and ID number. In that way, the user can easily move files between systems without ownership problems._

_UID numbers must be a whole number that is less than or equal to 2147483647. UID numbers are required for both regular user accounts and special system accounts. The following table lists the UID numbers that are reserved for user accounts and system accounts._

[User ID Numbers](https://docs.oracle.com/cd/E19120-01/open.solaris/819-2379/userconcept-3/index.html)

___

_UUID is an abbreviation for Universal Unique Identifier defined by RFC 4122 and has a size of 128-bit. It is created using internal algorithms that always generate a unique value._

[PostgreSQL – UUID Data Type](https://www.geeksforgeeks.org/postgresql-uuid-data-type/)

___

_Don't store PDFs in the database_

_There are no database features that can edit or process a PDF. Storing them is likely to lock up your db-session for extended periods. There is absolutely no reason whatsoever to do this. PostgreSQL is not a filesystem, it's a database._

[How can I store a pdf in PostgreSQL](https://dba.stackexchange.com/questions/36493/how-can-i-store-a-pdf-in-postgresql)

___

_Typically we save path or file names to the database. And store the actual files in any file management system like one drive, google cloud..._
[How to store pdf and png to postgres DB?](https://stackoverflow.com/questions/68439413/how-to-store-pdf-and-png-to-postgres-db)                                    