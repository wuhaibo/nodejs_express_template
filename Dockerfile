FROM node:9-alpine

WORKDIR /app
#
COPY ./src /app

#
RUN npm config set unsafe-perm true

# pm2
RUN npm install pm2 -g

# service
RUN npm install

# port
EXPOSE  80

# run 
CMD ["pm2-runtime", "./bin/www" ]