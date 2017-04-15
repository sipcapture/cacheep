<img src="https://cdn.pixabay.com/photo/2014/04/03/11/59/sheep-312776_960_720.png" width=100 />
<img src="http://i.imgur.com/Lnmza1J.png" width=100 />


# CACHEEP: LRU-CACHE API + ENUM DNS Server

Cacheep exposes an [LRU-CACHE](https://www.npmjs.com/package/lru-cache) with a simple Express REST API, happily managing simple key/values pairs or full JSON objects with custom expirations, automatically deleting the least-recently-used items. Data can be used to manage anything real-time, for correlation or blacklisting _(anything, really)_ to be consumed via broadly available interfaces such as REST, DNS/ENUM and more upcoming.

* status: experimental

### Usage
```
npm install
npm start
```
##### Custom Parameters
```
sudo MAX=100000 PORT=53 FILE='./data.json' npm start
```


### ENUM Example
##### Block Destination for 60 seconds
```
curl http://127.0.0.1:3000/api/set/4416/blocked/60000
```
#### ENUM Lookup
```
dig -t NAPTR 0.0.6.9.2.3.6.1.4.4.e164.arpa @127.0.0.1
```
---------

### IP Example

##### Block IP for 60 seconds w/ JSON Body
```
curl -X POST -H "Content-type: application/json" \
  -d '{"message": "scanner"}' \
  http://127.0.0.1:3000/api/set/10.20.30.40/60000
  ```
##### Un-Block IP
```
curl http://127.0.0.1:3000/api/unset/10.20.30.40
```
##### Check IP
```
curl http://127.0.0.1:3000/api/get/10.20.30.40
```

---------

### Statup Options

| ENV  	    | Description  	| Notes  |
|---	           |---	  |---  |
| ```PORT```     | Express API Port   | _(default: 3000)_      |
| ```MAX```      | LRU Max Cache Size | _(default: 10000)_     |
| ```FILE```     | LRU Cache File     | _(default: disabled)_  |
| ```DNS_PORT``` | DNS Server Port    | _(default: 54)_        |
| ```DNS_HOST``` | DNS Server Host    | _(default: 127.0.0.1)_ |
| ```DNS_ROOT``` | DNS Lookup Root    | _(default: e164.arpa)_ |


### API Calls

| Call  	    | Format  	| Response  |
|---	    |---	|---  |
| ```SET```  	  | ```/api/set/{key}/{value}/{seconds * 1000}```  	| ```{status}``` |
| ```GET```  	  | ```/api/get/{key}```  	| ```{value}``` |
| ```UNSET```  	| ```/api/unset/{key}```  	| ```{status}``` |





## TODO

* Express Auth
* Refine API
* ENUM Params from Cache

## ROADMAP 

* GunDB Support _(distribution, two-way updates)_
