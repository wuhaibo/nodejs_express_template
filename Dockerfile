FROM    node:9-alpine

WORKDIR /app
#
COPY ./src /app
RUN npm install

# pm2
RUN npm install pm2 -g

# port
EXPOSE  80

# run 
CMD ["pm2-runtime", "./bin/www" ]