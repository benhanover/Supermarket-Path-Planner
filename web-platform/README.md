### Development

```
docker run -it -v ${PWD}:/app -p 3000:3000 node:18 sh
cd app
npm run dev
open http://localhost:3000
```

### Production (before commiting)
```
docker compose up --build
open http://localhost
docker compose down
```