/**
 * 模型验证器
 */
class DataValidator{
    /**
     * 验证器集合
     */
    private static valiators:Map<string,Function>;

    /**
     * 是否拥有该名字的验证器
     * @param validatorName 
     */
    static hasValidator(validatorName:string){
        return this.valiators.has(validatorName);
    }

    /**
     * 添加验证器
     * @param name  验证器名 
     * @param foo   验证器方法
     */
    static addValidator(name:string,foo:Function){
        if(typeof foo !== 'function'){
            return;
        }
        this.valiators.set(name,foo);
    }

    /**
     * 添加验证器集
     * @param config {validatorName:foo,...} 
     */
    static addValidators(config:object){
        Object.getOwnPropertyNames(config).forEach((item)=>{
            if(typeof config[item] !== 'function'){
                return;
            }
            this.addValidator(item,config[item]);
        });
    }

    /**
     * 验证
     * @param name      验证名
     * @param value     验证内容
     * @param paramArr  附加参数，根据调用确定
     * @returns         通过/不通过
     */
    static valid(name:string,value:any,paramArr:any[]):boolean{
        if(!this.valiators.has(name)){
            return false;
        }
        let foo = this.valiators.get(name);
        if(Array.isArray(paramArr)){
            paramArr.unshift(value);
        }else{
            paramArr = [value];
        }
        return foo.apply(null,paramArr);
    }
}

/**
 * 初始化验证器
 */
DataValidator.addValidators({
    "min":function(value,min){
        return value>=min;
    },
    "max":function(value,max){
        return value<=max;
    },
    "between":function(value,min,max){
        return value>=min && value<=max;
    },
    "minLength":function(value,min){
        return typeof value === 'string' && value.length>=min;
    },
    "maxLength":function(value,max){
        return typeof value === 'string' && value.length<=max;
    },
    "betweenLength":function(value,min,max){
        return typeof value === 'string' && value.length>=min && value.length<=max;
    },
    "email":function(value){
        return /^\w+\S*@[\w\d]+(\.\w+)+$/.test(value);
    },
    "url":function(value){
        return /^(https?|ftp):\/\/[\w\d]+\..*/.test(value);
    },
    "mobile":function(value){
        return /^1[3-9]\d{9}$/.test(value);
    },
    "idno":function(value){
        return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
    }
});

export{DataValidator}

