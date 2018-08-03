import {observable} from 'mobx';

export class AddVlogStore {
    @observable media = ['a'];

    addMedia = media => this.media.push(media)

    actions = [
      {
        label: 'Video',
        fn: () => console.log('cheese')
      },
      {
        label: 'Crossfade',
      },
      {
        label: 'Title',
      },
      {
        label: 'Music',
      },
      {
        label: 'Branding element'
      }
    ]
}

export default AddVlogStore;
