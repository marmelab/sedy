FROM node:4
MAINTAINER Kévin Maschtaler <kevin@marmelab.com>

ENV HOME /root
WORKDIR /srv

RUN npm install --global nodemon

RUN useradd --create-home user
ENV HOME /home/user
USER user

CMD ["bash"]
