class PathFilter{
    do(request,response){
        const url = require("url");
        let path = url.parse(request.url).pathname;
        console.log('pathfilter',path);
        return true;
    }
}

export{PathFilter};