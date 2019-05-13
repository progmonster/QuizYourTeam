import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import '../model/collections';
import { Quizzes, Teams } from '../model/collections';


Meteor.publish('quizzes', function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() => {
    const grantedQuizzes = Roles.getGroupsForUser(this.userId, 'viewQuiz')
      .map(grantedGroup => grantedGroup.replace(/^quizzes\//, ''));

    return Quizzes.find({ _id: { $in: grantedQuizzes } });
  });
});

Meteor.publish('quiz', function (quizId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions

    Quizzes.find(quizId));
});

Meteor.publish('teams', function () {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions
    /*
          const grantedQuizzes = Roles.getGroupsForUser(this.userId, "viewQuiz")
            .map(grantedGroup => grantedGroup.replace(/^quizzes\//, ""));
      */

    Teams.find({}));
});

Meteor.publish('team', function (teamId) {
  if (!this.userId) {
    return [];
  }

  this.autorun(() =>
    // todo progmonster  check permissions

    Teams.find(teamId));
});

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl(`verify-email?token=${token}`);
};

Accounts.emailTemplates.from = 'akatorgin@yandex.ru';// todo progmonster

Accounts.config({
  sendVerificationEmail: true,
});

Meteor.methods({
  'quizzes.update': function (quiz) {
    check(this.userId, String);
    check(quiz._id, String);
    check(Roles.userIsInRole(this.userId, 'editQuiz', `quizzes/${quiz._id}`), true);

    Quizzes.update(quiz._id, quiz);
  },

  'quizzes.insert': function (quiz) {
    check(this.userId, String);
    check(quiz._id, undefined);

    const quizId = Quizzes.insert(quiz);

    Roles.addUsersToRoles(this.userId, ['viewQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['editQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['removeQuiz'], `quizzes/${quizId}`);
    Roles.addUsersToRoles(this.userId, ['passQuiz'], `quizzes/${quizId}`);

    return quizId;
  },

  'quizzes.remove': function (quizId) {
    check(this.userId, String);
    check(quizId, String);
    check(Roles.userIsInRole(this.userId, 'removeQuiz', `quizzes/${quizId}`), true);

    Quizzes.remove(quizId);

    Meteor.users.update({}, { $unset: { [`roles.quizzes/${quizId}`]: '' } }, { multi: true });
  },

  'teams.createTeam': function ({ title, description }) {
    check(this.userId, String);
    check(title, String);
    check(description, String);

    const createdAt = new Date();

    const teamId = Teams.insert({
      title,
      description,
      createdAt,
      updatedAt: createdAt,
      creator: this.userId,

      participants: [
        { userId: this.userId },
      ],
    });

    return teamId;
  },

  'teams.updateTeamSettings': function ({ _id, title, description }) {
    check(this.userId, String);
    check(_id, String);
    check(title, String);
    check(description, String);

    Teams.update(_id, {
      $set: {
        title,
        description,
        updatedAt: new Date(),
      },
    });
  },

  'teams.removeTeam': function (teamId) {
    check(this.userId, String);
    check(teamId, String);

    Teams.remove(teamId);
  },

});

Meteor.startup(() => {
  // code to run on server at startup
});
