import type { ErrorStatus } from '@/error/enums/error-status';
import { ErrorBase } from '@/error/utils/error-base';

export class IOError extends ErrorBase<ErrorStatus> {}
