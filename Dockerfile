FROM    node:9-alpine

WORKDIR /app
#
COPY ./src /app
RUN npm install

# port
EXPOSE  80

# run 
CMD ["npm", "run", "start" ]