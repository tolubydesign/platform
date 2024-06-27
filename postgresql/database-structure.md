# Commands used to create database

```shell
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

accounts

```shell
CREATE TABLE accounts (
  user_id uuid DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  password VARCHAR NOT NULL,
  account_type VARCHAR NOT NULL CHECK (account_type in ('user', 'admin')),
  user_group VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  PRIMARY KEY (user_id)
);
```

add accounts

```shell
INSERT INTO accounts (
  username,
  password,
  account_type,
  user_group,
  email,
  phone
)
VALUES
  (
    'John',
    'password1',
    'admin',
    null,
    'john.smith@example.com',
    '408-237-2345'
  ),
  (
    'Mike Wazowski',
    'password2',
    'admin',
    null,
    'mike.wazowski@example.com',
    '408-237-2344'
  ),
  (
    'Alex',
    'password3',
    'user',
    null,
    'alex.smith@example.com',
    '408-237-2343'
  ),
  (
    'Avery Johnson',
    'password1',
    'user',
    null,
    'johnson.avery@example.com',
    '408-237-2343'
  );
```

see all accounts

```shell
SELECT * FROM accounts;
```

update data insertion
```shell
INSERT INTO "Account" (
  username,
  password,
  account_type,
  user_group,
  email,
  phone
)
VALUES
  (
    'John',
    'password1',
    'admin',
    '',
    'john.smith@example.com',
    '408-237-2345'
  ),
  (
    'Mike Wazowski',
    'password2',
    'admin',
    '',
    'mike.wazowski@example.com',
    '408-237-2344'
  ),
  (
    'Alex',
    'password3',
    'user',
    '',
    'alex.smith@example.com',
    '408-237-2343'
  ),
  (
    'Avery Johnson',
    'password1',
    'user',
    '',
    'johnson.avery@example.com',
    '408-237-2343'
  );
```
