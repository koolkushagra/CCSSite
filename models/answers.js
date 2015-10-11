var mongoose = require('mongoose');

module.exports = mongoose.model('Answer',{
  reg_no: String,
  tech: {type:Array, default:[]},
  mang: {type:Array, default:[]},
  crea: {type:Array, default:[]}
});
