# Database

This project uses Docker to run the various databases.

If you do not have docker & docker compose installed, follow the official documentation to install Docker Engine: [Docker Installation](https://docs.docker.com/engine/install/).

## Setting Up

To start running the database simply run

```bash
$ docker compose up
# OR
$ docker compose up -d # to have the database run in the background
```

Doing this will run multiple images, including MinIO and PostgreSQL.

A copy of the databases created can be found within this folder. This is meant to allow for persistent data.

Please look at Dockers usage of volumes to disable this functionality: [Docker Documentation on Volumes](https://docs.docker.com/storage/volumes/).

___

### Additional: Commands

- _Check docker container environment variables_ \
`docker exec {container name} env` -> `docker exec platform-postgres env `

- _Access postgresql docker container_ \
`docker exec -ti {container name} psql -U {user}` -> `docker exec -ti platform-postgres psql -U postgres` 

