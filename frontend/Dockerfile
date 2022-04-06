# Dockerfile adapted from
# https://mherman.org/blog/dockerizing-a-react-app/

# Build the React app
# basically, this compiles the React jsx to static HTML and js files.
FROM node:14-alpine3.14 as build
WORKDIR /
ENV PATH /node_modules/.bin:$PATH
COPY package.json ./
#COPY package-lock.json ./
# COPY public/ public
# COPY src/ src
RUN npm i
RUN npm install react-scripts@3.4.1 -g
COPY . ./
RUN npm run build

# Serve these static files with NGINX.
FROM nginx:1.21.6-alpine
COPY --from=build /build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/52_8_249_5.pem /etc/ssl/52_8_249_5.pem
COPY nginx/52_8_249_5.key /etc/ssl/52_8_249_5.key
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
