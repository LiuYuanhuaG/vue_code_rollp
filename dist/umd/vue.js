(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    const OBSERVE_ARRAY = [
        'push',
        'pop',
        'shift',
        'unshift',
        'sort',
        'reverse',
        'splice'
    ];


    var orgArrMethods = Array.prototype;// 获取数组方法原型

    var arrayMethods = Object.create(orgArrMethods);//创建数组对象

    OBSERVE_ARRAY.map(function (m) {
        arrayMethods[m] = function () {
            console.log(this);
            var methodsArg = Array.prototype.slice.call(arguments); //获取方法传入的数据
            orgArrMethods[m].apply(this, methodsArg); //调用相应方法 这里不能使用arrayMethods数组对象的方法 会死循环
            var newArray;
            switch (m) {
                case 'push':
                case 'unshift':
                    newArray = methodsArg; // 这里应为传入得数据
                    break;
                case 'splice':
                    newArray = methodsArg.slice(2);
                    break;
            }
            console.log(newArray);
            // var vm= new Vue({el:'#app',data(){return {a:[{b:{c:'hhhh'},d:5}]}}})
            newArray && observeArray(newArray);
            // return rt
        };
    });

    // 处理对象数据 添加响应式
    function defineReactiveData(data, key, value) {

        observe(value); // 递归添加观察者 监听数据

        Object.defineProperty(data, key, {
            set(newValue) {
                // 判断是否新值 是则替换旧值
                if (newValue === value) return;
                observe(newValue); // 在设置值得时候也有能是对象,数组 所以在此需要在地调用观察者
                value = newValue;
            },
            get() {
                // console.log('获取响应式数据：key ' + key + '; value ', value);
                return value
            }
        });
    }

    function Observer(data) {
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods; // 为原型链上添加我们处理过的方法 方法调用查找时优先找到这里
            observeArray(data);
        } else {
            this.walk(data);
        }
    }

    // 添加walk方法 处理对象数据
    Observer.prototype.walk = function (data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            defineReactiveData(data, key, value);
        }
    };

    /*
    * 观察者
    */

    function observe(data) {
        console.log(data, 'prototype');
        if (typeof data !== 'object' || data === null) return;

        // 当数据没有问题交由观察者进行观察
        new Observer(data);
    }




    // 处理 数组数据
    function observeArray(data) {

        for (var i = 0; i < data.length; i++) {
            observe(data[i]); // 观察数组每一项元素 
        }
    }

    //数据代理
    function proxyData(vm, target, key) {

        //数据劫持将 vm._data.xxx 变为 vm.xxx
        Object.defineProperty(vm, key, {
            get() {
                return vm[target][key]
            },
            set(newValue) {
                return vm[target][key] = newValue
            }
        });
    }

    function initState(vm) {
        const options = vm.$options;

        if (options.data) {
            initData(vm);
        }
    }

    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}; // 使用call改变指向 可以使用
        for (let key in data) {
            //使用代理处理原始数据 劫持数据增加访问、设置的入口
            proxyData(vm, '_data', key);
        }
        // 观察 响应式数据处理
        observe(data);
    }

    function initMixin(Vue) {
        Vue.prototype._init = function (options) {
            const vm = this;

            vm.$options = options;

            initState(vm);
        };
    }

    function Vue(options) {

        //初始化
        this._init(options);
    }


    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
