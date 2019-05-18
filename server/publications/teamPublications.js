import { Meteor } from 'meteor/meteor';
import { Teams } from '../../model/collections';

Meteor.publish('teams', function () {
  if (!this.userId) {
    return [];
  }

  return Teams.find({
    'participants._id': this.userId,
  });
});

Meteor.publish('team', function (teamId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions
    Teams.find(teamId));
});
