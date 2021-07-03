export function createOfferError(pc, e) {
  console.error(pc + 'create Offer failde:', e);
}
export function setRemoteSDPSuccess(pc) {
  console.log(`${pc} set remote sdp sucess`);
}
export function setRemoteSDPError(pc, e) {
  console.log(`${pc} set remote sdp Erro :`, e);
}
export function setLocalSDPSuccess(pc) {
  console.log(`${pc} set local sdp sucess`);
}
export function setLocalSDPError(pc, e) {
  console.log(`${pc} set local sdp error`, e);
}

export function createOfferSuccessResponse(pc) {
  console.log(pc + ' create Offer success:');
}
