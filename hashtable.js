var Hashtable = function () {
    this.items = new Array();
    this.keys = new Array();
    this.itemsCount = 0;
    this.add = function (key, value) {
        if (!this.containsKey(key)) {
            this.items[key] = value;
            this.keys[this.itemsCount] = key;
            this.itemsCount++;
        }
        else {
            throw "key '" + key + "' allready exists."
        }
    }
    this.get = function (key) {
        if (this.containsKey(key))
            return this.items[key];
        else {
            return null;
        }
    }

    this.remove = function (key) {
        if (this.containsKey(key)) {
            this.items[key] = null;
            delete this.items[key];
            this.itemsCount--;
            for (var index = 0; index < this.keys.length; index++) {
                if (this.keys[index] == key) {
                    this.keys.splice(index, 1);
                }
            }
        }
        else {
            throw "key '" + key + "' does not exists."
        }
    }
    this.containsKey = function (key) {
        return typeof (this.items[key]) != "undefined";
    }
    this.containsValue = function containsValue(value) {
        for (var item in this.items) {
            if (this.items[item] == value) {
                return true;
            }
        }
        return false;
    }
    this.contains = function (keyOrValue) {
        return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);
    }
    this.clear = function () {
        this.items = new Array();
        this.keys = new Array();
        itemsCount = 0;
    }
    this.size = function () {
        return this.itemsCount;
    }
    this.isEmpty = function () {
        return this.size() == 0;
    }
    this.getKeys = function () {
        return this.keys;
    }
};

exports.Hashtable = Hashtable;