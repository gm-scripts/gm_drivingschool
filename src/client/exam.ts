import { conf, lang, wait, missionText, notifyText, error } from "./utils";
import { script } from "../config";

let waitForSync = false;

const startExam = async (examLabel: string): Promise<void> => {
  const player = PlayerPedId();
  let examVehicle: string;
  let licenseType: string;
  let plate: number;
  switch (examLabel) {
    case lang["menu"].exams.car:
      examVehicle = "car";
      licenseType = "drive";
      plate = 2;
      break;
    case lang["menu"].exams.bike:
      examVehicle = "bike";
      licenseType = "drive_bike";
      plate = 4;
      break;
    case lang["menu"].exams.truck:
      examVehicle = "truck";
      licenseType = "drive_truck";
      plate = 6;
      break;
    case lang["menu"].exams.bus:
      examVehicle = "bus";
      licenseType = "drive_bus";
      plate = 8;
      break;
  }
  const vehicleHash = GetHashKey(conf["vehicles"][examVehicle].model);
  RequestModel(vehicleHash);
  while (!HasModelLoaded(vehicleHash)) {
    await wait(0);
  }
  const vehicle = CreateVehicle(
    vehicleHash,
    conf["school"].spawn.x,
    conf["school"].spawn.y,
    conf["school"].spawn.z,
    conf["school"].spawn.h,
    true,
    true,
  );
  if (examVehicle === "truck" && conf["vehicles"].truck.useTrailer) {
    const trailerHash = GetHashKey(conf["vehicles"].truck.trailerModel);
    RequestModel(trailerHash);
    while (!HasModelLoaded(trailerHash)) {
      await wait(0);
    }
    const trailer = CreateVehicle(
      trailerHash,
      conf["school"].spawn.x,
      conf["school"].spawn.y,
      conf["school"].spawn.z,
      conf["school"].spawn.h,
      true,
      true,
    );
    AttachVehicleToTrailer(vehicle, trailer, 1.1);
    SetVehicleLivery(trailer, conf["vehicles"].truck.trailerLivery);
  }
  SetVehicleColours(vehicle, conf["vehicles"][examVehicle].color, 0);
  SetVehicleLivery(vehicle, conf["vehicles"][examVehicle].livery);
  TaskWarpPedIntoVehicle(player, vehicle, -1);
  SetVehicleFuelLevel(vehicle, 100.0);
  DecorSetFloat(vehicle, "_FUEL_LEVEL", GetVehicleFuelLevel(vehicle));
  const generatePlate = (): string => {
    return `SCHOOL${plate}${Math.floor(Math.random() * 9) + 1}`;
  };
  SetVehicleNumberPlateText(vehicle, generatePlate());
  /// TESTING
  let currentCheckPoint = -1;
  let lastCheckPoint = -2;
  let driveErrors = 0;
  let speedDelay = false;
  let healthDelay = false;
  let currentBlip = undefined;
  const makeMistake = async (type: string) => {
    if (type === "speed") {
      speedDelay = true;
      notifyText(
        lang["too_fast"].replace(
          "_limit_",
          conf["speedLimit"].limit.toString() + (conf["speedLimit"].useKmh ? "km/h" : "mph"),
        ),
      );
      driveErrors++;
      notifyText(
        lang["mistakes"]
          .replace("_mistakes_", driveErrors.toString())
          .replace("_max_", conf["maxMistakes"].practicalExam.toString()),
      ); 
      await wait(5000);
      speedDelay = false;
    } else if (type === "health") {
      healthDelay = true;
      notifyText(lang["damaged"]);
      driveErrors++;
      notifyText(
        lang["mistakes"]
          .replace("_mistakes_", driveErrors.toString())
          .replace("_max_", conf["maxMistakes"].practicalExam.toString()),
      );
      await wait(2000)
      healthDelay = false;
    }
  }
  let lastVehicleHealth = GetEntityHealth(vehicle);
  const checkInterval = setTick(() => {
    if (IsPedInAnyVehicle(player, false)) {
      const vehicle = GetVehiclePedIsIn(player, false);
      const speed = GetEntitySpeed(vehicle) * (conf["speedLimit"].useKmh ? 3.6 : 2.236936);
      if (speed > conf["speedLimit"].limit) {
        if (!speedDelay) {
          makeMistake("speed")
        }
      }
      const health = GetEntityHealth(vehicle);
      if (health < lastVehicleHealth) {
        if (!healthDelay) {
          makeMistake("health")
        }
      }
      lastVehicleHealth = GetEntityHealth(vehicle);
    }
  });
  const examInterval = setTick(() => {
    const coords = GetEntityCoords(player, false);
    const nextCheckpoint = currentCheckPoint + 1;
    if (conf["checkPoints"][nextCheckpoint] === undefined) {
      if (DoesBlipExist(currentBlip)) {
        RemoveBlip(currentBlip);
      }

      if (driveErrors <= conf["maxMistakes"].practicalExam) {
        stopExam(true, licenseType, vehicle);
      } else {
        stopExam(false, "", vehicle);
      }
      clearTick(examInterval);
      clearTick(checkInterval);
    } else {
      if (currentCheckPoint !== lastCheckPoint) {
        if (DoesBlipExist(currentBlip)) {
          RemoveBlip(currentBlip);
        }

        currentBlip = AddBlipForCoord(
          conf["checkPoints"][nextCheckpoint].x,
          conf["checkPoints"][nextCheckpoint].y,
          conf["checkPoints"][nextCheckpoint].z,
        );
        SetBlipRoute(currentBlip, true);

        lastCheckPoint = currentCheckPoint;
      }

      const distance = GetDistanceBetweenCoords(
        coords[0],
        coords[1],
        coords[2],
        conf["checkPoints"][nextCheckpoint].x,
        conf["checkPoints"][nextCheckpoint].y,
        conf["checkPoints"][nextCheckpoint].z,
        true,
      );

      if (distance <= conf["markers"].checkPoint.distance.show) {
        DrawMarker(
          conf["markers"].checkPoint.type,
          conf["checkPoints"][nextCheckpoint].x,
          conf["checkPoints"][nextCheckpoint].y,
          conf["checkPoints"][nextCheckpoint].z + conf["markers"].checkPoint.height,
          conf["markers"].checkPoint.direction.x,
          conf["markers"].checkPoint.direction.y,
          conf["markers"].checkPoint.direction.z,
          conf["markers"].checkPoint.rotation.x,
          conf["markers"].checkPoint.rotation.y,
          conf["markers"].checkPoint.rotation.z,
          conf["markers"].checkPoint.scale.x,
          conf["markers"].checkPoint.scale.y,
          conf["markers"].checkPoint.scale.z,
          conf["markers"].checkPoint.color.r,
          conf["markers"].checkPoint.color.g,
          conf["markers"].checkPoint.color.b,
          conf["markers"].checkPoint.alpha,
          conf["markers"].checkPoint.bob,
          conf["markers"].checkPoint.face,
          2,
          false,
          null,
          null,
          false,
        );
      }

      if (distance <= conf["markers"].checkPoint.distance.open && !waitForSync) {
        (async ():Promise<void> => {
          waitForSync = true;
          switch (conf["checkPoints"][nextCheckpoint].type) {
            case "next_point_speed":
              missionText(
                lang["checkPoints"].next_point_speed.replace(
                  "_limit_",
                  conf["speedLimit"].limit.toString() +
                    (conf["speedLimit"].useKmh ? "km/h" : "mph"),
                ),
                5000,
              );
              currentCheckPoint++;
              break;
            case "go_next_point":
              missionText(lang["checkPoints"].go_next_point, 5000);
              currentCheckPoint++;
              break;
            case "stop_for_ped":
              missionText(lang["checkPoints"].stop_for_ped, 5000);
              PlaySound(-1, "RACE_PLACED", "HUD_AWARDS", false, 0, true);
              FreezeEntityPosition(vehicle, true);
              await wait(4000);
              FreezeEntityPosition(vehicle, false);
              missionText(lang["checkPoints"].good_lets_cont, 5000);
              currentCheckPoint++;
              break;
            case "stop_look_left":
              missionText(lang["checkPoints"].stop_look_left, 5000);
              PlaySound(-1, "RACE_PLACED", "HUD_AWARDS", false, 0, true);
              FreezeEntityPosition(vehicle, true);
              await wait(6000);
              FreezeEntityPosition(vehicle, false);
              missionText(lang["checkPoints"].good_turn_right, 5000);
              currentCheckPoint++;
              break;
            case "watch_traffic_lightson":
              missionText(lang["checkPoints"].watch_traffic_lightson, 5000);
              currentCheckPoint++;
              break;
            case "stop_for_passing":
              missionText(lang["checkPoints"].stop_for_passing, 5000);
              PlaySound(-1, "RACE_PLACED", "HUD_AWARDS", false, 0, true);
              FreezeEntityPosition(vehicle, true);
              await wait(6000);
              FreezeEntityPosition(vehicle, false);
              currentCheckPoint++;
              break;
            case "last_point":
              currentCheckPoint++;
              break;
            default:
              error(
                `Checkpoint type "${conf["checkPoints"][nextCheckpoint].type}" is invalid`,
                "config",
              );
          }
          waitForSync = false;
        })();
      }
    }
  });
};

const stopExam = (bool: boolean, license: string, vehicle: number): void => {
  if (bool) {
    notifyText(lang["passed"]);
    emitNet(`gm_${script}:addLicense_${conf["framework"]}`, license);
  } else {
    notifyText(lang["failed"]);
  }
  SetEntityAsMissionEntity(vehicle, true, true)
  DeleteVehicle(vehicle)
};

export { startExam };
