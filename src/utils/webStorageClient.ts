import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next';

import _ from 'lodash';
import { constants } from '@/settings/constants';

const webStorageClient = {
  set(key: string, raw: any, opts?: any) {
    const value = _.isString(raw) ? raw : JSON.stringify(raw);
    setCookie(key, value, opts);
  },

  async get(key: string) {
    const cookie = await getCookie(key);
    const raw = (cookie as string) || '';
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  },

  remove(key: string) {
    deleteCookie(key);
  },

  has(key: string) {
    return hasCookie(key);
  },

  setProfileHash(value: string, opts?: any) {
    this.set(constants.PROFILE_HASH, value, opts);
  },

  setToken(token: string, opts?: any) {
    this.set(constants.ACCESS_TOKEN, token, opts);
  },
};

export default webStorageClient;
