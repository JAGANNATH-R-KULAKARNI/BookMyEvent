FROM node:12.16.3-alpine3.9

WORKDIR /app
COPY package.json ./
RUN npm install --only=prod
# The npm install command will install the devDependencies along other dependencies when run inside a package directory,
# in a development environment (the default).
# Use npm install --only=prod (or --only=production) to install only dependencies, 
# and not devDependencies, regardless of the value of the NODE_ENV environment variable.
COPY ./ ./
CMD ["npm", "start"]