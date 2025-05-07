import { TextEncoder, TextDecoder } from "util";
import 'whatwg-fetch';

if (global.TextEncoder === undefined) {
  global.TextEncoder = TextEncoder as any;
}
if (global.TextDecoder === undefined) {
  global.TextDecoder = TextDecoder as any;
}