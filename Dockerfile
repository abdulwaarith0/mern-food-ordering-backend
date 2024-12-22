ARG NODE_VERSION=18.12.0

# Build stage
FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app


# Install dependencies 
COPY package.json package-lock.json ./
RUN npm install


# Copy the rest of the application code
COPY . .


# Build the application and compile typescript to javascript
RUN npm run build


FROM node:${NODE_VERSION}-alpine as final

WORKDIR /app


# Copy only the necessary files from the build stage
COPY --from=build /app /app


EXPOSE 7000


CMD ["npm", "run", "start"]