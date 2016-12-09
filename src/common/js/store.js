// 缓存--存
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if(!seller){
    seller = {};
    seller[id] = {};
  } else{
    seller = JSON.parse(seller);
    if(!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  localStorage.__seller__ = JSON.stringify(seller);
} ;

// 缓存--读
export function loadFromLocal(id,key,def) {
  let seller = window.localStorage.__seller__;
  if(!seller){
    return def;
  }
  seller = JSON.parse(seller)[id];
  if(!seller){
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
