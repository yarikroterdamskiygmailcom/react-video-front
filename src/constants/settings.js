const settings = [
  {
    title: 'Network',
    settings: [
      {
        name: 'Limit mobile data',
        desc: 'Only upload videos using Wi-Fi',
        storeKey: 'limitNetwork'
      },
    ]
  },
  {
    title: 'Notifications',
    settings: [
      {
        name: 'Enable push notifications',
        desc: 'Allow push notifications on this device',
        storeKey: 'pushNotifications'
      },
      {
        name: 'Show orientation warning',
        desc: 'Show warning when not in landscape mode',
        storeKey: 'orientationWarning'
      },
    ]
  },
];

export default settings;
