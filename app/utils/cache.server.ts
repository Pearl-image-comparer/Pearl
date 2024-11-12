import { Keyv } from "keyv";
import { KeyvMemcache } from "@keyv/memcache";

const memcache = new KeyvMemcache(
  process.env.MEMCACHE_HOST ?? "localhost:11211",
);
const keyv = new Keyv({ store: memcache });

export default keyv;
