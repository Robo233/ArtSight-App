import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Exhibition } from '../types/types-app';
import { t } from "i18next";

export const scheduleExhibitionNotification = async (exhibition: Exhibition) => {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  if(!exhibition.schedule) {
    return;
  }

  if (exhibition.schedule.scheduleType !== 'Custom' || exhibition.schedule.customEntries.length === 0) {
    return;
  }

  const customEntry = exhibition.schedule.customEntries[0];
  if (!customEntry.date) {
    console.error('No date provided in the custom schedule entry.');
    return;
  }

  const exhibitionDate = new Date(customEntry.date);
  if (isNaN(exhibitionDate.getTime())) {
    console.error('Invalid date format in custom schedule entry.');
    return;
  }

  const notificationTime = new Date(exhibitionDate);
  notificationTime.setDate(notificationTime.getDate() - 1);

  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') {
    console.error('Permission for notifications was not granted.');
    return;
  }

  let rawId = parseInt(exhibition.id.replace(/[^0-9]/g, ''));

  const maxInt = 2147483647;
  const notificationId = rawId % maxInt; // This is needed, because the id must be a Java int

  await LocalNotifications.schedule({
    notifications: [
      {
        id: notificationId,
        title: t("notificationService.title"),
        body: `${t("notificationService.bodyPrefix")} ${exhibition.name}! ${t("notificationService.bodySuffix")}`,
        schedule: { at: notificationTime },
        extra: {
            target: `/exhibition/${exhibition.id}`,
        },
      },
    ],
  });
};

export const cancelExhibitionNotification = async (exhibition: Exhibition) => {
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    let rawId = parseInt(exhibition.id.replace(/[^0-9]/g, ''));
    if (isNaN(rawId)) {
      rawId = Math.floor(Math.random() * 10000);
    }
    const maxInt = 2147483647;
    const notificationId = rawId % maxInt;
  
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }],
    });

};
