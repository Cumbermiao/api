//1  防抖：只有等事件停止触发后 n 秒才执行一次该函数
//func：防抖执行的函数，wait：延迟时间， immediate：是否立即执行
export function debounce(func, wait, immediate) {
    var timeout, result
    var debounced = function () {
        var context = this
        var args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var runNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (runNow) result = func.apply(context, args)

        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait)
        }
        return result
    }
    //取消防抖
    debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}


//2  节流：持续触发的时候，每 n 秒执行一次该函数。
//func:执行函数，wait：时间周期，options：{leading:false//第一次不执行,trailing: false //表示禁用停止触发的回调，最后一次触发后不执行}
export function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function () {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    };

    return throttled;
}

//3  去重

//两层循环去重
export function unique1(array) {
    // res用来存储结果
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++) {
            if (array[i] === res[j]) {
                break;
            }
        }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        if (j === resLen) {
            res.push(array[i])
        }
    }
    return res;
}

//使用filter和 indexOf，  对象不去重 NaN 会被忽略掉
export function unique2(array) {
    var res = array.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })
    return res;
}

//排序后去重， 对象和 NaN 不去重 数字 1 不去重
export function unique3(array) {
    return array.concat().sort().filter(function (item, index, array) {
        return !index || item !== array[index - 1]
    })
}

//使用键值对和json进行去重，可以对所有的类型进行去重
export function unique4(array) {
    var obj = {};
    return array.filter(function (item, index, array) {
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(
            item)] = true)
    })
}

//Set 对象不去重 NaN 去重
export function unique5(array) {
    return [...new Set(array)];
}






//4  识别类型
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function (item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

export function type(obj) {
    // 一箭双雕
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}

//判断是否是function类型
export function isFunction(obj) {
    return type(obj) === 'function'
}

//是否为数组
export function isArray(obj){
    return type(obj) === 'array'
}

//实现jq extend
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

export function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}


export function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为 {}
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免 extend(a,,b) 这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                // 解决循环引用
                if (target === copy) {
                    continue;
                }

                // 要递归的对象必须是 plainObject 或者数组
                if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                    // 要复制的对象属性值类型需要与目标属性值相同
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};


export const dataFormate = function(fmt){
    var o = {
        "M+":this.getMonth()+1,
        "d+":this.getDate(),
        "h+":this.getHours(),
        "m+":this.getMinutes(),
        "s+":this.getSeconds(),
        "q+":Math.floor((this.getMonth()+3)/3),
        "S+":this.getMilliseconds()
    }
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    if(new RegExp("("+k+")").test(fmt)) fmt = fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)))
    return fmt
}

