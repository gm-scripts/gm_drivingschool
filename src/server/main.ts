import { script } from "../config";

onNet(`gm_${script}:getLicenses_esx`, data => {
  const _source = source;
  emit(`esx_license:getLicenses`, source, (licenses: unknown) => {
    emitNet(`gm_${script}:callback`, _source, licenses, data.CallbackID);
  });
});

onNet(`gm_${script}:addLicense_esx`, (type: string) => {
  emit(`esx_license:addLicense`, source, type);
});
onNet(`gm_${script}:tryUiPayment_esx`, data => {
  let ESX: unknown;
  emit("esx:getSharedObject", obj => (ESX = obj));
  const xPlayer = ESX["GetPlayerFromId"](source);
  let cb = false;
  if (xPlayer.getMoney() >= data.payment) {
    xPlayer.removeMoney(data.payment);
    cb = true;
  } else {
    xPlayer.removeAccountMoney("bank", data.payment)
    cb = true;
  }
  emitNet(`gm_${script}:callbackUi`, source, cb, data.CallbackID);
});

onNet(`gm_${script}:tryPayment_esx`, data => {
  let ESX: unknown;
  emit("esx:getSharedObject", obj => (ESX = obj));
  const xPlayer = ESX["GetPlayerFromId"](source);
  let cb = false;
  if (xPlayer.getMoney() >= data.payment) {
    xPlayer.removeMoney(data.payment);
    cb = true;
  } else {
    xPlayer.removeAccountMoney("bank", data.payment)
    cb = true;
  }
  emitNet(`gm_${script}:callback`, source, cb, data.CallbackID);
});