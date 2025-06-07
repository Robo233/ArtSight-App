import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useHistory } from 'react-router-dom';
import { PluginListenerHandle } from '@capacitor/core';

// This is needed in order to open the page of the exhibition when a notification is pressed
const useNotificationNavigation = () => {
  const history = useHistory();
  const listenerHandleRef = useRef<PluginListenerHandle>();

  useEffect(() => {
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      const { extra } = notificationAction.notification;
      if (extra?.target) {
        history.push(extra?.target);
      }
    }).then((handle) => {
      listenerHandleRef.current = handle;
    });

    return () => {
      listenerHandleRef.current?.remove();
    };
  }, [history]);
};

export default useNotificationNavigation;
