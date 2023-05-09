FROM python:3.8-alpine

LABEL "com.github.actions.name"="AWS Amplify PR Previews for Public Repository"
LABEL "com.github.actions.description"="This action deploys your AWS Amplify pull request for your public repository"
LABEL "com.github.actions.icon"="git-commit"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/genesiscommunitysuccess/docs.git"
LABEL "homepage"="https://github.com/genesiscommunitysuccess/docs"
LABEL maintainer="Daniel Barros"

ENV AWSCLI_VERSION='1.18.14'

RUN pip install --quiet --no-cache-dir awscli==${AWSCLI_VERSION}
RUN apk --no-cache add curl

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
