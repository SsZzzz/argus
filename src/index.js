import jsError from './lib/jsError';
import XHR from './lib/XHR';
import fetch from './lib/fetch';
import device from './lib/device';
import timing from './lib/time';
import longTask from './lib/longTask';
import network from './lib/network';
import pv from './lib/pv';

jsError();
XHR();
fetch();
device();
timing();
longTask();
network();
pv();
