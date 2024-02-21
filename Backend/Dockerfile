FROM node:20.11

COPY ./ .

ENV GENERATE_SOURCEMAP false

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]