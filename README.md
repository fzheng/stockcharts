### Set Up

```sh
brew install memcached
brew services start memcached
cd /path/to/stockcharts
npm install
npm start
```

Then visit <http://localhost:3000/>

## Changing the Port

You can change the port number by setting the `$PORT` environment variable before invoking any of the scripts above, e.g.,

```sh
PORT=3001 npm start
```

## Flushing Memcached Server

```sh
echo 'flush_all' | nc localhost 11211
```