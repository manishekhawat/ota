import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {AppRegistry} from 'react-native';
import RNRestart from 'react-native-restart';

export const OtaUpdateSystem = () => {
  const [updateInfo, setUpdateInfo] = useState<{
    version: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const response = await fetch('http://192.168.1.2:3000/api/latest-update');
      const update = await response.json();

      setUpdateInfo(update);
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const downloadAndApplyUpdate = async () => {
    if (updateInfo) {
      const {url, version} = updateInfo;
      const localFilePath = `${RNFS.DocumentDirectoryPath}/update-${version}.bundle`;
      console.log(url, version, localFilePath);
      try {
        const downloadResult = await RNFS.downloadFile({
          fromUrl: url,
          toFile: localFilePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          await applyUpdate(localFilePath);
          Alert.alert('Update downloaded and applied. Restarting the app...');
          // RNRestart.Restart();
        } else {
          console.error('Failed to download update:', downloadResult);
        }
      } catch (error) {
        console.error('Error downloading update:', error);
      }
    }
  };

  const applyUpdate = async (bundlePath: string) => {
    const bundleExists = await RNFS.exists(bundlePath);
    console.log(bundlePath);
    if (!bundleExists) {
      throw new Error('Downloaded bundle file does not exist');
    }

    AppRegistry.registerRunnable('main', async () => {
      const currentBundlePath = `${RNFS.DocumentDirectoryPath}/index.android.bundle`;
      console.log(currentBundlePath);
      await RNFS.moveFile(bundlePath, currentBundlePath);
      // RNRestart.Restart();
    });

    AppRegistry.runApplication('main', {
      initialProps: {},
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Welcome to the React Native OTA Update System</Text>
      {updateInfo?.version && (
        <View>
          <Text>New version available: {updateInfo?.version}</Text>
          <Button title="Update Now" onPress={downloadAndApplyUpdate} />
        </View>
      )}
      {updateInfo?.error && (
        <View>
          <Text>No New Bundle Available</Text>
        </View>
      )}
    </View>
  );
};
