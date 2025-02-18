import {Format} from 'logform';
import {format} from 'winston';

export class ProductionLogFormat {
    get(): Format {
        return format.json();
    }
}
