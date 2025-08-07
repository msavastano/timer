# Use a lightweight Nginx image as the base
FROM nginx:alpine

# Copy the static files to the Nginx web root directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow access to the web server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
