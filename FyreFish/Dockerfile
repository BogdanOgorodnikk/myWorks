# production environment
FROM nginx:1.20.1-alpine
COPY dist /usr/share/nginx/html
COPY nginx-conf/default.conf /etc/nginx/conf.d/
EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]
