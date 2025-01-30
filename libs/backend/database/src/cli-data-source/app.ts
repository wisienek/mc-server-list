import {DataSource} from 'typeorm';
import {getConfig} from '../lib/db-config';
import 'reflect-metadata';

export default new DataSource(getConfig());
