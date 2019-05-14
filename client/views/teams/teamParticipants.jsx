import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import AlertDialog from '../../components/alertDialog';
import { withTracker } from 'meteor/react-meteor-data';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { INVITED } from '../../../model/participantStates';
import Methods from '../../methods';
import { snackbarActions as snackbar } from '../../components/snackbar';

const styles = {
  participantTableRowRoot_currentUser: {
    fontWeight: 'bold',
  },

  participantTableRowRoot_invitedUser: {
    color: 'lightblue',
  },
};

function GeneralParticipant(props) {
  const {
    participant,
    onParticipantRemove,
  } = props;

  return (
    <TableRow>
      <TableCell>{participant.email}</TableCell>
      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Active</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => onParticipantRemove(participant)}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}


function InvitedParticipant(props) {
  const {
    classes,
    participant,
    onParticipantInvitationCancel,
  } = props;

  return (
    <TableRow>
      <TableCell classes={{ root: classes.participantTableRowRoot_invitedUser }}>
        {participant.email}
      </TableCell>

      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Invited</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => onParticipantInvitationCancel(participant)}
        >
          Cancel invitation
        </Button>
      </TableCell>
    </TableRow>
  );
}

function YouAsParticipant(props) {
  const {
    classes,
    participant,
  } = props;

  return (
    <TableRow>
      <TableCell classes={{ root: classes.participantTableRowRoot_currentUser }}>
        {`${participant.email} (you)`}
      </TableCell>

      <TableCell>{participant.fullName}</TableCell>
      <TableCell>Active</TableCell>
      <TableCell align="right" />
    </TableRow>
  );
}

class TeamParticipants extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      participantToBeRemoved: null,
      removeParticipantConfirmationOpened: false,
      newUserEmail: '',
    };
  }

  onParticipantRemove = (participant) => {
    this.setState({
      participantToBeRemoved: participant,
      removeParticipantConfirmationOpened: true,
    });
  };

  onRemoveParticipantConfirmationClosed = (confirmed) => {
    const participant = this.state.participantToBeRemoved;

    this.setState({
      participantToBeRemoved: null,
      removeParticipantConfirmationOpened: false,
    });

    const {
      onParticipantRemove,
    } = this.props;

    if (confirmed) {
      onParticipantRemove(participant);
    }
  };

  onNewUserEmailChange = (newUserEmail) => {
    this.setState({ newUserEmail });
  };

  renderParticipantRow = (participant) => {
    const participantId = participant.userId;

    const { currentUserId } = this.props;

    if (participant.userId === currentUserId) {
      return <YouAsParticipant key={participantId} participant={participant} {...this.props} />;
    }

    if (participant.state === INVITED) {
      return (
        <InvitedParticipant
          key={participantId}
          participant={participant}
          {...this.props}
        />
      );
    }

    return (
      <GeneralParticipant
        key={participantId}
        participant={participant}
        {...this.props}
      />
    );
  };

  render() {
    const {
      classes,
      team,
      currentUserId,
      onNewUserInvite,
    } = this.props;

    const {
      removeParticipantConfirmationOpened,
      newUserEmail,
    } = this.state;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(team.participants)
              .map(this.renderParticipantRow)}
          </TableBody>
        </Table>

        <AlertDialog
          open={removeParticipantConfirmationOpened}
          title="Remove the team participant?"
          contentText=""
          okText="Remove"
          cancelText="Cancel"
          handleClose={this.onRemoveParticipantConfirmationClosed}
        />

        <Grid item xs={12} sm={12} md={8}>
          <TextField
            label="User Email"
            value={newUserEmail}
            onChange={event => this.onNewUserEmailChange(event.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => onNewUserInvite(newUserEmail.trim())}
          >
            Invite an user
          </Button>
        </Grid>
      </Paper>
    );
  }
}

TeamParticipants.propTypes = {
  /*
    classes: PropTypes.shape({
      teamSettingsCardSubheaderTitle: PropTypes.string.isRequired,
      teamSettingsCardHeaderTitle: PropTypes.string.isRequired,
      teamSettingsCardHeaderRoot: PropTypes.string.isRequired,
    }).isRequired,

    teamLoaded: PropTypes.bool.isRequired,
    isNewTeam: PropTypes.bool.isRequired,
    team: PropTypes.instanceOf(Team),
    onTeamSave: PropTypes.func.isRequired,
    onTeamRemove: PropTypes.func.isRequired,
  */
};

TeamParticipants.defaultProps = {
//  team: null,
};

const mapDispatchToProps = (dispatch, { team }) => ({
  async onNewUserInvite(newUserEmail) {
    try {
      await Methods.teams.inviteNewUserAsync(team._id, newUserEmail);

      dispatch(snackbar.show({ message: 'The invitation has been sent' }));
    } catch (error) {
      dispatch(snackbar.show({ message: `Error sending the invitation: ${error.message}` }));
    }
  },

  async onParticipantRemove(participant) {
    console.log(participant);
  },
});

export default compose(
  withTracker(() => ({
    currentUserId: Meteor.userId(),
  })),

  withStyles(styles),

  connect(null, mapDispatchToProps),
)(TeamParticipants);