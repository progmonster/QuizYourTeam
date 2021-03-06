import React from 'react';
import * as PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import People from '@material-ui/icons/People';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core';
import dashboardStyle from './dashboardStyle';
import { Quizzes, Teams } from '../../../model/collections';
import QuizTileContainer from '../quizzes/quizTile';
import TeamTile from '../teams/teamTile';
import { quizzesSubscription, teamsSubscription } from '../../subscriptions';
import EmptyState from '../../components/emptyState';
import Link from '@material-ui/core/Link';

class DashboardPage extends React.PureComponent {
  renderActiveTeam(team) {
    const {
      classes,
      quizzes,
    } = this.props;

    const teamQuizzes = quizzes.filter(({ teamId }) => teamId === team._id);

    return (
      <Grid key={team._id} container spacing={24}>
        <Grid item xs={12} className={classes.team}>
          <Paper elevation={1}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography
                  variant="title"
                  className={classes.teamTitle}
                >
                  <Grid container alignItems={'center'}>
                    <People />&nbsp;{team.title}
                  </Grid>
                </Typography>
              </Grid>

              <Grid item xs={12} container>
                {teamQuizzes.map(({ _id: quizId }) => (
                  <Grid key={quizId} item xs={12} sm={12} md={6} lg={4} xl={3}>
                    <div className={classes.quizTile}>
                      <QuizTileContainer
                        quizId={quizId}
                      />
                    </div>
                  </Grid>
                ))}

                {teamQuizzes.length === 0 && (
                  <EmptyState title="There are no quizzes yet" />
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  className={classes.newQuizButton}
                  pt={12}
                  color="primary"
                  component={RouterLink}
                  to={`/quiz-edit?team=${team._id}`}
                >
                  Add a new quiz
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  static renderNoTeamsDescription() {
    return (
      <span>
        <span>Ask another users to send an invitation to you or </span>

        <Link component={RouterLink} to="/team-settings">create</Link>

        <span> your own team to have ability to create or pass quizzes.</span>
      </span>
    );
  }

  static haveOnlyTeamInvitationsDescription() {
    return (
      <span>
        <span>Accept the invitation(s) or </span>

        <Link component={RouterLink} to="/team-settings">create</Link>

        <span> your own team to have ability to create or pass quizzes.</span>
      </span>
    );
  }

  render() {
    const {
      classes,
      quizzes,
      invitedTeams,
      activeTeams,
      quizzesSubscriptionReady,
      teamsSubscriptionReady,
    } = this.props;

    if (!quizzesSubscriptionReady || !teamsSubscriptionReady) {
      return <div />;
    }

    if (activeTeams.length === 0 && invitedTeams.length === 0) {
      return (
        <EmptyState
          title="You have no any quizzes and teams yet."
          description={DashboardPage.renderNoTeamsDescription()}
        />
      );
    }

    return (
      <div>
        {activeTeams.length === 0 && (
          <Grid container spacing={24} className={classes.haveOnlyInvitedTeamsEmptyState}>
            <Grid item xs>
              <EmptyState
                title="You have no any quizzes yet."
                description={DashboardPage.haveOnlyTeamInvitationsDescription()}
              />
            </Grid>
          </Grid>
        )}

        {invitedTeams.length > 0 && (
          <Grid container spacing={24} className={classes.invitedTeamsBlock}>
            <Grid item xs>
              <Grid container spacing={24}>
                {invitedTeams.map(({ _id: teamId }) => (
                  <Grid item key={teamId} xs={12} sm={12} md={6} lg={4} xl={3}>
                    <TeamTile teamId={teamId} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {activeTeams.map(team => this.renderActiveTeam(team))}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
  quizzesSubscriptionReady: PropTypes.bool.isRequired,
  teamsSubscriptionReady: PropTypes.bool.isRequired,
  quizzes: PropTypes.array.isRequired,
  invitedTeams: PropTypes.array.isRequired,
  activeTeams: PropTypes.array.isRequired,
};

export default compose(
  withTracker(() => {
    const quizzesSubscriptionReady = quizzesSubscription.ready();

    const teamsSubscriptionReady = teamsSubscription.ready();

    const quizzes = Quizzes
      .find()
      .fetch();

    const invitedTeams = Teams
      .findTeamsWithUserInvitedState(Meteor.userId())
      .fetch();

    const activeTeams = Teams
      .findTeamsWithUserActiveState(Meteor.userId())
      .fetch();

    return {
      quizzesSubscriptionReady,
      teamsSubscriptionReady,
      quizzes,
      invitedTeams,
      activeTeams,
    };
  }),

  withStyles(dashboardStyle),
)(DashboardPage);
