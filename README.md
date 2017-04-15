# LRU-CACHE + ENUM DNS Server + API

This App exposes [LRU-CACHE](https://www.npmjs.com/package/lru-cache) via a simple REST API.<br>
Data is used to manage a real-time blacklist (or anything, really) feeding an ENUM/DNS server.

### Example
##### Block Destination for 60 seconds
```
curl http://127.0.0.1:3000/api/set/4416329600/blocked/60000

```
##### Un-Block Destionation
```
curl http://127.0.0.1:3000/api/unset/4416329600

```

#### ENUM Lookup
```
dig -t NAPTR 0.0.6.9.2.3.6.1.4.4.e164.arpa @127.0.0.1
```
---------

### Statup Options
* ```PORT```: Express API Port _(default: 3000)_
* ```MAX```:  LRU Max Cache Size _(default: 10000)_
* ```DNS_PORT```:  LRU Max Cache Size _(default: 54)_
* ```DNS_HOST```:  LRU Max Cache Size _(default: 127.0.0.1)_

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
* GunDB Support
