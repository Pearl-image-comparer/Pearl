import { Keyv } from "keyv";
import { KeyvMemcache } from "@keyv/memcache";

// TODO: Configure cache server URI.
const memcache = new KeyvMemcache("localhost:11211");
const keyv = new Keyv({ store: memcache });

export default keyv;
