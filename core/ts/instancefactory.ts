import { AopFactory} from "./aopfactory";

/**
 * 实例工厂
 */
interface Argument{
    index:number;   //参数索引
    value:any;      //参数置
}
interface InstanceCfg{
    name:string;            //实例名
    path:string;            //模块路径（相对noomi.ini配置的modulepath）
    singleton:boolean;      //单例模式
    class_name:string;      //类名
    params:Array<any>;      //参数列表
}

/**
 * 实例对象
 */
interface InstanceObj{
    instance:object;            //实例对象
    class:any;                  //类引用
    singleton:boolean;          //单例标志
    params:Array<any>;          //构造器参数
}

class InstanceFactory{
    static factory:any = new Map();
    static mdlBasePath:string;
    /**
     * 添加单例到工厂
     * @param cfg 实例配置
     */
    static addInstance(cfg:InstanceCfg){
        if(this.factory.has(cfg.name)){
            throw "该实例名已存在";
        }
        const path = require('path');
        let mdl = require(path.resolve(this.mdlBasePath,cfg.path));
        //支持ts 和js ，ts编译后为{className:***},node 直接输出为 class
        if(typeof mdl === 'object'){
            mdl = mdl[cfg.class_name];
        }
        // class
        if(mdl.constructor !== Function){
            throw "模块必须为class";
        }
       
        //默认true
        let singleton = cfg.singleton!==undefined?cfg.singleton:true;
        
        let insObj=<InstanceObj>{
            class:mdl,
            singleton:singleton
        };

        if(singleton){   //单例，需要实例化
            insObj.instance = new mdl(cfg.params);
        }else{                  //非单例，不需要实例化
            insObj.params = cfg.params;
        }

        this.factory.set(cfg.name,insObj); 
    }

    /**
     * 获取实例
     * @param name  实例名
     * @return      实例化的对象  
     */
    static getInstance(name:string){
        if(!this.factory.has(name)){
            throw "实例不存在";
        }
        let ins:InstanceObj = this.factory.get(name);
        if(!ins){
            return null;
        }
        if(ins.singleton){
            return ins.instance;
        }else{
            let mdl = ins.class;
            return new mdl(ins.params);
        }
    }

    /**
     * 获取instance object
     * @param name instance name
     */
    static getInstanceObj(name:string):InstanceObj{
        if(!this.factory.has(name)){
            throw "实例不存在";
        }
        return this.factory.get(name);
    }

    /**
     * 执行方法
     * @param config {}
     * @param instanceName  实例名 
     * @param methodName    方法名
     * @param params        参数
     */
    
    static exec(instanceName:string,methodName:string,params:Array<any>):any{
        let instance = this.getInstance(instanceName);
        if(!instance || !instance[methodName]){
            throw "实例或方法不存在！";
        }
        
        return new Promise((resolve,reject)=>{
            let result;
            try{
                result = instance[methodName].apply(instance,params);
                if(result instanceof Promise){
                    result.catch(err=>{
                        reject(err.message);
                    }).then(result=>{
                        resolve(result);
                    },result=>{
                        reject(result);
                    });
                }else{
                    resolve(result);
                }
            }catch(e){
                reject(e.message);
            }
        });
    }

    /**
     * 解析实例配置文件
     * @param path 文件路径
     */
    static parseFile(path:string,mdlPath?:string){
        interface InstanceJSON{
            files:Array<string>;        //引入文件
            instances:Array<any>;       //实例配置数组
        }
        const pathTool = require('path');
        const fs = require("fs");
        this.mdlBasePath = mdlPath || './';
        //读取文件
        let jsonStr:string = fs.readFileSync(new URL("file://" + path),'utf-8');
        let json:InstanceJSON = null;
        try{
            json = JSON.parse(jsonStr);
        }catch(e){
            throw "实例文件配置错误"!
        }

        if(json.files !== undefined && json.files.length>0){
            json.files.forEach((item)=>{
                this.parseFile(pathTool.resolve(pathTool.dirname(path),item),this.mdlBasePath);
            });
        }

        if(json.instances && json.instances.length>0){
            json.instances.forEach((item)=>{
                this.addInstance(item);
            });
        }
    }

    /**
     * 获取instance工厂
     */
    static getFactory(){
        return this.factory;
    }
}

export {InstanceFactory};
