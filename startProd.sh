docker stop evse-app
docker remove evse-app
docker run -d --restart unless-stopped --name evse-app -p 3000:3000 -p 2000:2000 -v evse-data:/app/config evse-app