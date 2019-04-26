import { Platform } from 'react-native';

export const HOST  = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
export const APIV1 = `${HOST}/api/v1`;
export const JSON_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};