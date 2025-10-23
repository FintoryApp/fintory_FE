/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@react-native-firebase/app';

// Firebase는 google-services.json 파일을 통해 자동으로 초기화됨
console.log('🔍 [DEBUG] Firebase 자동 초기화 대기 중...');

// Firebase 초기화를 위한 지연 실행
setTimeout(() => {
  try {
    const { getApps } = require('@react-native-firebase/app');
    const apps = getApps();
    console.log('🔍 [DEBUG] Firebase 앱 개수 (지연 확인):', apps.length);
    
    if (apps.length > 0) {
      console.log('✅ [DEBUG] Firebase 자동 초기화 성공');
    } else {
      console.log('❌ [DEBUG] Firebase 자동 초기화 실패 - google-services.json 확인 필요');
    }
  } catch (error) {
    console.error('❌ [DEBUG] Firebase 확인 실패:', error);
  }
}, 3000);

AppRegistry.registerComponent(appName, () => App);
