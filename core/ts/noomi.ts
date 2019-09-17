import {InstanceFactory} from "./instancefactory";
import {RouteFactory} from "./routefactory";
import {StaticResource} from "./staticresource";
import {NoomiHttp} from "./noomihttp";
import { AopFactory } from "./aopfactory";
import { FilterFactory } from "./filterfactory";
import { PageFactory } from "./pagefactory";
import { SessionFactory } from "./sessionfactory";
class noomi{
    constructor(port){
        const mdlPath = require('path');
        this.init(mdlPath.join(process.cwd(),'config'));
        const http = require("http");
        const url = require("url");
        const querystring = require("querystring");
        http.createServer((req,res)=>{
            let path = url.parse(req.url).pathname;
            const paramstr = url.parse(req.url).query;
            const params = querystring.parse(paramstr);
            // console.log(req.body);
            //过滤器执行
            if(this.handleFilter(path,req,res)){  
                this.handleUpload(req,params);
                this.resVisit(req,res,path,params);
            }
        }).listen(port);
    }

    /**
     * 初始化
     */
    init(basePath:string){
        console.log('服务启动中...');
        const fs = require('fs');
        let iniJson:object = null;
        const path = require('path');

        try{
            let iniStr = fs.readFileSync(path.resolve('config','noomi.ini'),'utf-8');
            iniJson = JSON.parse(iniStr);
        }catch(e){
            throw e;
        }

        //模块路径加入staticresource的禁止访问路径,/开头
        let mdlPath:string = iniJson['module_path'];
        StaticResource.addPath(mdlPath.charAt(0) === '/'?mdlPath:'/' + mdlPath);
        
        //session工厂初始化
        if(iniJson.hasOwnProperty('session')){
            SessionFactory.init(iniJson['session']);    
        }
        
        //上下文初始化
        if(iniJson.hasOwnProperty('context_path')){
            console.log('实例工厂初始化...');
            let ctxPath = iniJson['context_path'];
            if(ctxPath !== null && (ctxPath = ctxPath.trim())!==''){
                this.loadCtx(path.resolve('config',ctxPath),iniJson['module_path']);
            }
            console.log('实例工厂初始化完成！');
        }
        

        //filter初始化
        if(iniJson.hasOwnProperty('filter_path')){
            console.log('过滤器初始化...');
            let rPath = iniJson['filter_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadFilter(path.resolve('config',rPath));
            }
            console.log('过滤器初始化完成！');
        }

        //路由初始化
        if(iniJson.hasOwnProperty('route_path')){
            console.log('路由工厂初始化...');
            let rPath = iniJson['route_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadRoute(path.resolve('config',rPath));
            }
            console.log('路由工厂初始化完成！');
        }

        //aop初始化
        if(iniJson.hasOwnProperty('aop_path')){
            console.log('aop初始化...');
            let rPath = iniJson['aop_path'];
            if(rPath !== null && (rPath = rPath.trim())!==''){
                this.loadAop(path.resolve('config',rPath));
            }
            console.log('aop初始化完成！');
        }

        //errorPage
        if(iniJson.hasOwnProperty('error_page')){
            this.setErrorPages(iniJson['error_page']);
        }

        console.log('服务启动成功！！！');
    }

    /**
     * 加载context
     * @param path 
     */
    loadCtx(path:string,mdlPath:string){
        InstanceFactory.parseFile(path,mdlPath);
    }

    /**
     * 加载路由
     * @param path 
     */
    loadRoute(path:string){
        RouteFactory.parseFile(path);
    }

    /**
     * 加载aop配置文件
     * @param path  文件路径
     */
    loadAop(path:string){
        AopFactory.parseFile(path);
    }

    /**
     * 过滤器文件加载
     * @param path  文件路径
     */
    loadFilter(path:string){
        FilterFactory.parseFile(path);
    }

    /**
     * 设置异常提示页面
     * @param pages page配置（json数组）
     */
    setErrorPages(pages:Array<any>){
        if(Array.isArray(pages)){
            pages.forEach((item)=>{
                PageFactory.addErrorPage(item.code,item.location);
            });
        }
    }
    /**
     * 设置禁止访问路径（静态资源）
     * @param dirPath 
     */
    setForbiddenPath(dirPath:string){
        StaticResource.addPath(dirPath);
    }

    /**
     * 过滤器处理
     */
    handleFilter(url:string,request:any,response:any):boolean{
        return FilterFactory.doChain(url,request,response);
    }

    /**
     * 处理上传
     * @param req 
     */
    handleUpload(req:any,res:any){
        const type = req.headers['content-type'];
        if(type && type.includes('multipart/form-data')){
            let chunks = [];
            let num = 0;
            let body = '';
            req.on("data",function(chunk){
                chunks.push(chunk);
                num+=chunk.length;
            });
            req.on("end",()=>{
                
                const fs = require('fs');
                const path = require('path');
                //最终流的内容本体
                // let buffer=Buffer.concat(chunks,num);
                
                fs.writeFileSync(path.resolve(process.cwd(),'./log.out'),chunks,{encoding:'utf8',flag:'w'});
                // //新建数组接收出去\r\n的数据下标
                // let rems=[];
                
                // //根据\r\n分离数据和报头
                // for (let i = 0; i < buffer.length; i++) {
                //     let v=buffer[i];
                //     let v2=buffer[i+1];
                //     // 10代表\n 13代表\r
                //     if (v==13&&v2==10) {
                //         rems.push(i);
                //     }
                // }

                //获取上传图片信息
            //     let picmsg_1 = buffer.slice(rems[0]+2,rems[1]).toString();
            //     console.log(picmsg_1);
            //     let filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];
            //     console.log(filename);
        
            //     //图片数据
            //     var nbuf = buffer.slice(rems[3]+2,rems[rems.length-2]);
            //     let address="./"+filename;
            //     //创建空文件并写入内容
            //     fs.writeFile(address,nbuf,function(err){
            //         if (err) {
            //             console.log(err);
            //         }else{
            //             console.log("创建成功")
            //         }
            //     });
            //     res.end();
            });
            
            //接收post如data 流 buffer
            // req.on('data', function (d) {
            //     body += d;
            // });

            // req.on('end', function () {
            //     let file = querystring.parse(body, '\r\n', ':');
            //     let fileInfo = file['Content-Disposition'].split('; ');
            //     let fileName = '';
            //     let ext = '';
            //     for (let value in fileInfo) {
            //         if (fileInfo[value].indexOf("filename=") != -1) {
            //             fileName = fileInfo[value].substring(10, fileInfo[value].length - 1);

            //             if (fileName.indexOf('\\') != -1) {
            //                 fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
            //             }
            //             ext = fileName.substr(fileName.indexOf('.') + 1, fileName.length);
            //         }
            //     }

            //     let upperBoundary = body.toString().indexOf(file['Content-Type'].substring(1)) + file['Content-Type'].substring(1).length;

            //     let binaryDataAlmost = body.toString().substring(upperBoundary).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

            //     // 上传文件重命名
            //     let uuidFileName = `${uuid()}.${ext}` 
            //     //上传文件 本地存放地址
            //     let uploadDirFile = `./${uuidFileName}` 

            //     //创建文件流
            //     let writerStream = fs.createWriteStream(uploadDirFile);

            //     //开始 —— 写入文件到本地
            //     writerStream.write(binaryDataAlmost.substring(0, binaryDataAlmost.indexOf(`--${boundary}--`)), 'binary'); 
            //     //写入完成
            //     writerStream.end();
            //     writerStream.on('finish', function () {
            //         console.log("写入完成。");
            //         //删除刚刚创建好的本地文件 -> 只有在把文件存起来的时候需要删除掉本地，否则不要用。
            //         fs.unlinkSync(uploadDirFile) 
            //         res.send({ data: data, code: 0, msg: 'ok' })
            //     });
            // });
        }
    }
    /**
     * 资源访问
     * @param req       request
     * @param res       response 
     * @param path      url路径
     * @param params    参数
     */
    resVisit(req:any,res:any,path:string,params:object){
        let routeFlag = false;
        //先进行路由处理
        try{
            const util = require('util');
            let re = RouteFactory.handleRoute(path,params,req,res);
            if(re !== undefined){
                routeFlag = true;
                if(util.types.isPromise(re)){ //是否是promise对象
                    re.then((txt)=>{
                        NoomiHttp.writeDataToClient(res,{
                            data:txt
                        });
                    },(err)=>{
                        NoomiHttp.writeDataToClient(res,{
                            data:err
                        });    
                    });
                }else{
                    NoomiHttp.writeDataToClient(res,{
                        data:re
                    });
                }
            }
            
        }catch(e){
            if(e === '1000' || e === '1001'){  //实例或方法不存在
                routeFlag = false;
            }else{
                NoomiHttp.writeDataToClient(res,{
                    data:e
                });
            }
        }
        //路由处理失败,或许是静态资源
        if(!routeFlag){
            new Promise((resolve,reject)=>{
                StaticResource.load(path,resolve,reject);
            }).catch((err)=>{
                return Promise.reject(err);
            }).then((re:any)=>{
                NoomiHttp.writeDataToClient(res,{
                    data:re.file,
                    type:re.type
                });
            },(errCode)=>{
                //存在异常页，直接跳转，否则回传404
                let page = PageFactory.getErrorPage(errCode);
                if(page){
                    NoomiHttp.redirect(res,page);
                }else{
                    NoomiHttp.writeDataToClient(res,{
                        statusCode:errCode
                    });
                }
            });
        }
    }
}

export {noomi};
