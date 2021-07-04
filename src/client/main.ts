import ts from "typescript";
import { script } from "../config";
let callbacks: unknown;
callbacks = 0;
callbacks = {};
const RegisterNetEvent = (data: string) => {
  ts.transpile(`RegisterNetEvent(${data})`);
};
RegisterNetEvent(`gm_${script}:callback`);
onNet(`gm_${script}:callback`, (result: unknown, id: number) => {
  callbacks[id](result);
  delete callbacks[id];
});
const serverCallback = (name: string, data: unknown, cb: unknown): void => {
  let id: number;
  id = 0;
  id = Object.keys(callbacks).length++;
  callbacks[id] = cb;
  data["CallbackID"] = id;
  emitNet(name, data);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

import { conf, lang, quest, helpText, notifyText } from "./utils";

let isConfigSynced = false;
const exams = [];
let hasDmv = false;

const activateHasDmv = (): void => {
  hasDmv = true;
};
const configLoaded = (): void => {
  const examTypes = ["car", "bike", "bus", "truck"];
  for (let i = 0; i < examTypes.length; i++) {
    if (conf["exams"][examTypes[i]]) {
      exams.push({
        label: lang["menu"].exams[examTypes[i]],
        id: i,
        complete: false,
        price: conf["prices"].allFree
          ? lang["free"]
          : lang["currency"].replace("_price_", conf["prices"][examTypes[i]]),
      });
    }
  }
  isConfigSynced = true;
  const marker = conf["markers"].school;
  const school = conf["school"];
  const keys = conf["keys"];
  const blip = conf["blip"];
  let theBlip: number;
  if (school.showBlip) {
    theBlip = AddBlipForCoord(school.marker.x, school.marker.y, school.marker.z);
    SetBlipSprite(theBlip, blip.id);
    SetBlipDisplay(theBlip, 4);
    SetBlipScale(theBlip, blip.size);
    SetBlipColour(theBlip, blip.color);
    SetBlipAsShortRange(theBlip, true);
    BeginTextCommandSetBlipName("STRING");
    AddTextComponentString(lang["blip_title"]);
    EndTextCommandSetBlipName(theBlip);
  }
  serverCallback(`gm_${script}:getLicenses_${conf["framework"]}`, {}, licenses => {
    for (let i = 0; i < licenses.length; i++) {
      if (licenses[i].type === "dmv") {
        activateHasDmv();
      }
    }
  });
  setTick(() => {
    const player = PlayerPedId();
    const coords = GetEntityCoords(player, true);
    if (
      marker.type != -1 &&
      GetDistanceBetweenCoords(
        coords[0],
        coords[1],
        coords[2],
        school.marker.x,
        school.marker.y,
        school.marker.z,
        true,
      ) < marker.distance.show
    ) {
      DrawMarker(
        marker.type,
        school.marker.x,
        school.marker.y,
        school.marker.z + marker.height,
        marker.direction.x,
        marker.direction.y,
        marker.direction.z,
        marker.rotation.x,
        marker.rotation.y,
        marker.rotation.z,
        marker.scale.x,
        marker.scale.y,
        marker.scale.z,
        marker.color.r,
        marker.color.g,
        marker.color.b,
        marker.alpha,
        marker.bob,
        marker.face,
        2,
        false,
        null,
        null,
        false,
      );
      if (
        GetDistanceBetweenCoords(
          coords[0],
          coords[1],
          coords[2],
          school.marker.x,
          school.marker.y,
          school.marker.z,
          true,
        ) < marker.distance.open
      ) {
        if (hasDmv) {
          helpText(lang["press_e"]);
        } else {
          helpText(
            lang["press_e_theory"].replace(
              "_price_",
              conf["prices"].allFree ? 0 : conf["prices"].theory,
            ),
          );
        }
        if (IsControlJustPressed(0, keys.openMenu)) {
          serverCallback(`gm_${script}:getLicenses_${conf["framework"]}`, {}, licenses => {
            let found = false;
            for (let i = 0; i < licenses.length; i++) {
              if (
                licenses[i].type === "drive" ||
                licenses[i].type === "drive_bike" ||
                licenses[i].type === "drive_truck" ||
                licenses[i].type === "drive_bus" ||
                licenses[i].type === "dmv"
              ) {
                let license = "none";
                switch (licenses[i].type) {
                  case "drive":
                    license = lang["menu"].exams["car"];
                    break;
                  case "drive_bike":
                    license = lang["menu"].exams["bike"];
                    break;
                  case "drive_truck":
                    license = lang["menu"].exams["truck"];
                    break;
                  case "drive_bus":
                    license = lang["menu"].exams["bus"];
                    break;
                  case "dmv":
                    found = true;
                    break;
                }
                for (let i = 0; i < exams.length; i++) {
                  if (license === exams[i].label) {
                    exams.splice(i, 1);
                  }
                }
              }
            }
            if (found) {
              if (!exams[0]) {
                notifyText(lang["no_exams"]);
              } else {
                SendNuiMessage(
                  JSON.stringify({
                    type: "gm_drivingschool_popup",
                    closed: false,
                  }),
                );
                SetNuiFocus(true, true);
              }
            } else {
              if (conf["prices"].allFree) {
                SendNuiMessage(
                  JSON.stringify({
                    type: "gm_open_dschool",
                    closed: false,
                  }),
                );
                SetNuiFocus(true, true);
              } else {
                serverCallback(
                  `gm_${script}:tryPayment_${conf["framework"]}`,
                  { payment: conf["prices"].theory },
                  (successful: boolean) => {
                    if (successful) {
                      SendNuiMessage(
                        JSON.stringify({
                          type: "gm_open_dschool",
                          closed: false,
                        }),
                      );
                      SetNuiFocus(true, true);
                    }
                  },
                );
              }
            }
          });
        }
      }
    }
  });
};

export { configLoaded, isConfigSynced, exams, activateHasDmv };
