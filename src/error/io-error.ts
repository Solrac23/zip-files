import type { ErrorStatusType } from './enums/error-status';
import { ErrorBase } from './utils/error-base';

export class IOError extends ErrorBase<ErrorStatusType> {}
