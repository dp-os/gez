import _Tms, { type TmsDepNotifyParams } from '@fmfe/tms.js';

import { Micro } from './micro';
import { fixMod } from './mod';
import { Square } from './square';
import type { Types as MicroTypes } from './types';

const Tms: typeof _Tms = fixMod(_Tms);

export { Tms, type TmsDepNotifyParams, Micro, type MicroTypes, Square };
