mongo --eval "db.getSiblingDB('crypto').createUser({'user':'admin', 'pwd':'admin','roles':['readWrite']});db.getSiblingDB('crypto').createCollection('orders');db.getSiblingDB('crypto').createCollection('settings');"
mongo --eval "db.getSiblingDB('crypto').settings.insert({cash: 100000000})"
