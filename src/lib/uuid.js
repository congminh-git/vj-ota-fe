export function generateUUID() {
  let dt = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    dt += performance.now(); // thêm độ chính xác cao hơn
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random()*16) % 16 | 0;
    dt = Math.floor(dt/16);
    return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
  });
}
