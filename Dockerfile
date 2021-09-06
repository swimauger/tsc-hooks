FROM "node"

WORKDIR /test

COPY hooks hooks

COPY jest.config.js .

RUN npm i -g jest

WORKDIR /test/hooks/copy-files/test
RUN yarn add tsc-hooks@dev && yarn build

WORKDIR /test/hooks/example/test
RUN yarn add tsc-hooks@dev && yarn build

WORKDIR /test/hooks/file-permissions/test
RUN yarn add tsc-hooks@dev && yarn build

WORKDIR /test/hooks
CMD [ "jest" ]
