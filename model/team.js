import sumBy from 'lodash/sumBy';
import some from 'lodash/some';
import TeamParticipant from './teamParticipant';
import { ACTIVE, INVITED } from './participantStates';
import TeamCreator from './teamCreator';
import { TeamRoles as Roles } from './roles';

export default class Team {
  _id;

  title;

  description;

  creator;

  participants;

  constructor(doc = {}) {
    if (doc._id) {
      this._id = doc._id;
    } else {
      delete this._id;
    }

    this.title = doc.title;
    this.description = doc.description;
    this.creator = new TeamCreator(doc.creator);

    this.participants = (doc.participants || []).map(
      participant => new TeamParticipant(participant),
    );
  }

  getActiveParticipantCount() {
    return sumBy(this.participants, ({ state }) => (state === ACTIVE ? 1 : 0));
  }

  isUserInInvitedState(userId) {
    return some(this.participants, {
      _id: userId,
      state: INVITED,
    });
  }

  getAdmins() {
    return this.participants.filter(({ role }) => role === Roles.adminRole);
  }

  getParticipantRole =
    participantId => this.participants.find(({ _id }) => _id === participantId).role;
}
