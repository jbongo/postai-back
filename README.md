

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.









clone :
nodejs
npm
docker
docker compose
yarn :
    corepack enable
    corepack prepare yarn@stable --activate
    yarn --version
    yarn install

docker stop $(docker ps -q --filter ancestor=postgres) 2>/dev/null && docker-compose up --build
npx prisma migrate dev

rm -rf dist  # Nettoie le build
#yarn build   # Reconstruit le projet
yarn start:dev  # Relance en mode dev

#launch app whatch mode 
yarn start:dev

  console.log(`🚀 Server running on: http://localhost:${port}`);

```bash
$ requirement
#argon2 is better than bcrypt
#$ npx prisma init

```

## Project setup

```bash
$ yarn install
#$ npx prisma --help
#$ npx prisma init

```

```bash
#codeding mode
#docker setup
#module > service > controller > dto  > pipe (evoid guard like if(!dto.email or !(email type of string)))
#prisma
#$ npx prisma init

```

## NEST COMMAND
```bash
#generate module 
$ nest g module module_name

#generate service /without spec files
$ nest g service service_name --no-spec  #ALLWAYS GEN MODULE BEFORE SERVICES

#launch app whatch mode 



```


## RUN : DEV MODE (later think to github mode with .devcontainer)
```bash 
#LAUNCH APP IN DEV MODE

#open docker destop

#open terminal
#run docker compose : docker-compose up service_name -d or docker-compose up -d
$ docker-compose up postgres -d
#run migrate prisma
$ npx prisma migrate dev
#run prisma studio
$ npx prisma studio

#copier asset dans dist (nest-cli.json pour l'instant nest ne copie que les json)
$ rm -rf dist  # Nettoie le build
$ yarn build   # Reconstruit le projet
$ yarn start:dev  # Relance en mode dev

#launch app whatch mode 
$ yarn start:dev

#open insomnia



#npx prisma migrate status
#To apply migrations in production run prisma migrate deploy.


```

```bash
#launch containers 
$ docker-compose up -d 
# sepecify service to run $ docker-compose up service_name -d
# run only db service : docker-compose up postgres -d

#error case, postgres port can be used by :
    #host postgres
        # check with : sudo lsof -i :5432
        # stop process : sudo systemctl stop postgresql
    #docker postgres of another container 
        # docker ps
        # docker stop <nom_du_conteneur>

#create db migration to run prisma : Appliquez les migrations
$ npx prisma migrate dev #en si datasource en localhost
#sinon sur docker
docker exec -it backend_prisma bash # pour loger sur le container puis aller sur prisma pour rm les tables existantes
npx prisma migrate dev --name add-phone-to-user
npx prisma generate

---- Gerer le pb migration 
rm -rf dist
rm -rf node_modules yarn.lock package-lock.json
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
rm -rf node_modules/.cache

#sudo chown -R $(whoami):$(whoami) .
#sudo chown -R $(whoami):$(whoami) .


yarn install

#à partir d'ici avec les conteneur down
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

yarn add -D prisma@latest
yarn add @prisma/client@latest


rm -rf dist #pas utiliser
yarn tsc --build --force #pas utiliser



yarn start:dev

----




#arreter les containeur et relance :
#docker compose down et docker-compose up --build

#open prisma studion /or create a pgadmin service incontainer (like phpmyadmin with mysql)
$ npx prisma studio

#launch app whatch mode 
$ yarn start:dev

#apply prisma change in db : Regénérer le client Prisma - Si vous avez modifié le schéma Prisma, regénérez le client Prisma pour vous assurer qu'il est à jour :
$ npx prisma generate #or use $npx prisma migrate dev,  for new migration

#delete prisma db and regenerate : Regénérez le client Prisma 
$ npx prisma migrate reset

#Générer une migration 
$ npx prisma migrate dev --name add_post_table
```






## Compile and run the project

```bash
#launch containers 
$ docker-compose up -d

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Traduction module 
```bash
#Générer les fichiers pour une nouvelle langue :
$ yarn generate:i18n fr

#translate auto ne marche pas il faut utiliser chatgpt et aussi penser aux param lenth nom etc
# Traduire les fichiers pour une nouvelle langue avec un fournisseur disponible par defaut:
$ yarn translate fr

# Traduire avec un fournisseur spécifique
$ yarn translate fr google
$ yarn translate fr libre
$ yarn translate fr argos
#avec le dp strategy on peut facilement ajouter un autre provider


```


```bash
# add new module to automate lise in  src/scripts/translation/generate-i18n.ts
$ const FILES = ['common.json', 'http.json', 'auth.json', 'user.json', 'admin.json']; #make a json of module's list to translate

#default language and add new language :src/i18n/i18n.config.ts
$ fallbackLanguage: 'en',
$ supportedLanguages: ['fr', 'en', 'es'], // Langues supportées
#make a json of available's language supported in app 

```



## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


---------------------CICD-----
pas besoin de faire des yarn et docker à tout vas en local
tout est containeriser 
en local avec docker file et docker-compose
en remote avec github (les test auto séront integré plus tard)

url app : http://localhost:3333
url prisma : http://localhost:5555/
