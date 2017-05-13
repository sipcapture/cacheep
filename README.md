<img src="http://i.imgur.com/Lnmza1J.png" width=100 />
<img src="https://cdn.pixabay.com/photo/2014/04/03/11/59/sheep-312776_960_720.png" width=100 />



# CACHEEP: Least-Recently-Used Cache API

Cacheep is a potentially harmful tool built around an [LRU-CACHE](https://www.npmjs.com/package/lru-cache) with a simple Express REST API attached. It's main function is managing simple key/values pairs or full JSON objects with custom TTL/expirations, automatically dropping the least-recently-used items. Behind the scenes, it can syncronize data, trigger actions and fill in many roles where data can be used to manage anything real-time, for correlation, blacklisting, interactive actions _(anything, really)_ to be consumed via broadly available interfaces such as REST, DNS/ENUM and more upcoming.

__Cacheep__ can also leverage integration with the __HEPIC__ Stack to exchange and retrieve realtime data.

* status: _experimental_

<img src="http://i.imgur.com/d5wqN19.gif" />

### Usage
```
npm install
npm start
```
##### Custom Parameters
```
sudo MAX=100000 PORT=53 FILE='./data.json' npm start
```
---------

### Documentation
Check the [Wiki](https://github.com/sipcapture/cacheep/wiki) for Documentation and full Examples



## TODO

* Express Auth
* Refine API Structure
* ENUM Params from Cache
* GunDB Support _(distribution, two-way updates)_


# Mailing List
Our target is to create a simple, powerful, lightweight tool anyone can use to protect their setup, big or small.
Join us discussing and improving our project:<br>
* https://groups.google.com/forum/#!forum/voip-dbl-talk
