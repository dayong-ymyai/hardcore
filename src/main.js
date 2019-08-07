'use strict';

typeModules['tianpan'] = require(`./diagram/tianpan`)
typeModules['dipan'] = require(`./diagram/dipan`)
typeModules['jin'] = require(`./diagram/jin`)
typeModules['huo'] = require(`./diagram/huo`)
typeModules['shui'] = require(`./diagram/shui`)
typeModules['yunpan'] = require(`./diagram/yunpan`)
typeModules['wheel'] = require(`./diagram/wheel`)
typeModules['dspiral'] = require(`./diagram/dspiral`)
// typeModules['yunpanhome'] = require(`./diagram/yunpanhome`)


if(IS_PROD){
    console.log("生产环境屏蔽调试日志")
    console.log   = function(){
        
    }
}
// console.error   = function(...messages){
//     logger.error(`${JSON.stringify(messages)}`)
// }

class Trtd {
	constructor(div, config){

		try{
            if(config.model){
                var tmpModel = go.Model.fromJson(config.model);
                if(tmpModel && tmpModel.modelData && tmpModel.modelData.type){
                    config.type = tmpModel.modelData.type
                }
            }
        }catch(e){
            console.error(e)
        }
		console.log("type:",config.type)
		var trtdClass = typeModules[config.type]
		return new trtdClass(div, config);
	}
}

Trtd.go = go;
/*eslint-disable no-undef */
Trtd.version = TRTD_VERSION
/*eslint-enable no-undef */
console.info(`Trtd version:${Trtd.version}`)
if (typeof window !== 'undefined') {
	window.Trtd = Trtd;
}

// export default Trtd;
module.exports = Trtd