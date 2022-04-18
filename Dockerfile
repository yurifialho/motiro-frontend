# pull official base image
FROM node:12.18.2

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
#copies package.json and package-lock.json to Docker environment
COPY ./app/package.json ./
COPY ./app/package-lock.json ./

#RUN apk add --no-cache --virtual python make g++

#RUN apk add --no-cache --virtual .gyp \
#        python2 \
#        make \
#        g++ \
#    && npm install \
#    && apk del .gyp

# Installs all node packages
RUN npm install 


# Copies everything over to Docker environment
COPY ./app ./
EXPOSE 3000
# start app
CMD ["npm", "start"]