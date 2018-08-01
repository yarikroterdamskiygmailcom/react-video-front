const settings = [
  {
    title: 'Network',
    settings: [
      {
        name: 'Limit mobile data',
        description: 'Only upload videos using Wi-Fi'
      },
      {
        name: 'Direct upload',
        description: 'Only use when uploading doesnt work normally'
      },
    ]
  },
  {
    title: 'Notifications',
    settings: [
      {
        name: 'Enable push notifications',
        description: 'Allow push notifications on this device'
      },
      {
        name: 'Show orientation warning',
        description: 'Show warning when not in landscape mode'
      },
    ]
  },
  {
    title: 'Security',
    settings: [
      {
        name: 'Automatic login',
        description: 'Save username and password on this device'
      },
    ]
  },
];

export default settings;
