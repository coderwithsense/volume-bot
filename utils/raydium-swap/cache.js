import { PublicKey } from "@solana/web3.js";
import jsonfile from "jsonfile";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "./data/pool_data.json");

export const readCachePoolData = (cacheTime) => {
  let cacheData = {
    time: 0,
    ammPools: [],
    clmmPools: [],
    cpmmPools: [],
  };
  try {
    console.log("reading cache pool data");
    const data = jsonfile.readFileSync(filePath);
    if (Date.now() - data.time > (cacheTime ?? 1000 * 60 * 10)) {
      console.log("cache data expired");
      return cacheData;
    }
    cacheData.time = data.time;
    cacheData.ammPools = data.ammPools.map((p) => ({
      ...p,
      id: new PublicKey(p.id),
      mintA: new PublicKey(p.mintA),
      mintB: new PublicKey(p.mintB),
    }));
    cacheData.clmmPools = data.clmmPools.map((p) => ({
      ...p,
      id: new PublicKey(p.id),
      mintA: new PublicKey(p.mintA),
      mintB: new PublicKey(p.mintB),
    }));
    cacheData.cpmmPools = data.cpmmPools.map((p) => ({
      ...p,
      id: new PublicKey(p.id),
      mintA: new PublicKey(p.mintA),
      mintB: new PublicKey(p.mintB),
    }));
    console.log("read cache pool data success");
  } catch {
    console.log("cannot read cache pool data");
  }

  return {
    ammPools: cacheData.ammPools,
    clmmPools: cacheData.clmmPools,
    cpmmPools: cacheData.cpmmPools,
  };
};

export const writeCachePoolData = (data) => {
  console.log("caching all pool basic info..");
  fs.mkdir(path.join(__dirname, "../data"), (err) => {
    if (err) {
      return console.error(err);
    }
  });
  jsonfile
    .writeFile(filePath, {
      time: Date.now(),
      ammPools: data.ammPools.map((p) => ({
        id: p.id.toBase58(),
        version: p.version,
        mintA: p.mintA.toBase58(),
        mintB: p.mintB.toBase58(),
      })),
      clmmPools: data.clmmPools.map((p) => ({
        id: p.id.toBase58(),
        version: p.version,
        mintA: p.mintA.toBase58(),
        mintB: p.mintB.toBase58(),
      })),
      cpmmPools: data.cpmmPools.map((p) => ({
        id: p.id.toBase58(),
        version: p.version,
        mintA: p.mintA.toBase58(),
        mintB: p.mintB.toBase58(),
      })),
    })
    .then(() => {
      console.log("cache pool data success");
    })
    .catch((e) => {
      console.log("cache pool data failed", e);
    });
};
