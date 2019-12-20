# base image
FROM node



# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm config set proxy http://proxy.corp.panalpina.com:10139
RUN npm config set https-proxy http://proxy.corp.panalpina.com:10139
RUN npm config set strict-ssl false
RUN npm install -g @angular/cli

# add app
COPY . /app
RUN npm install

# start app
CMD ng serve --host 0.0.0.0