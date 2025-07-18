FROM node:18.20.8

WORKDIR /usr/src/face-recognition-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]