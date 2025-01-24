
### Development
```
docker run -it -v ${PWD}:/app -p 5173:5173 node:18 sh
cd app
npm run dev -- --host 0.0.0.0
http://localhost:5173/
```

### Before push
```
docker compose up --build
test http://localhost
docker compose down
```