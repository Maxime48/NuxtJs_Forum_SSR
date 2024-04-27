# NuxtJs Forum SSR

A simple forum application built with TypeScript, NuxtJs, Vuetify, mdi, pinia, and prisma.

*Made for learning purposes, contributions are welcome*


## Setup

Make sure to install docker, then run the following command to start:

```bash
docker-compose up -d
```

Docker will start to install the dependencies, then the file ```init.ts``` will be executed to create the database and seed it with a default admin user.

If you want to change the default admin user, you can do it by changing the values in the file ```init.ts``` or later on the ```/profile``` page.

Simply go to [http://localhost:3000](http://localhost:3000) to see the application running.

## Production

Never run it in production, it's not secure at all.

Instead, try this homemade commercial solution [https://builtbybit.com/resources/laranet.23140/](https://builtbybit.com/resources/laranet.23140/)
