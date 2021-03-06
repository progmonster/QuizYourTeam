import {
  grayColor,
  hexToRgb,
  successColor,
  whiteColor,
} from '/client/assets/jss/material-dashboard-react.jsx';

const dashboardStyle = theme => ({
  haveOnlyInvitedTeamsEmptyState: {
    marginBottom: '2em',
  },

  invitedTeamsBlock: {
    marginBottom: '4em',
  },

  team: {
    marginBottom: '4em',
  },

  teamTitle: {
    padding: '1em',
  },

  newQuizButton: {
    margin: '1em',
  },

  quizTile: {
    margin: '1em',
  },

  successText: {
    color: successColor[0],
  },
  upArrowCardCategory: {
    width: '16px',
    height: '16px',
  },
  stats: {
    color: grayColor[0],
    display: 'inline-flex',
    fontSize: '12px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  cardCategory: {
    color: grayColor[0],
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0',
  },
  cardCategoryWhite: {
    color: `rgba(${hexToRgb(whiteColor)},.62)`,
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  addCardFab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
    zIndex: 10000,
  },
});

export default dashboardStyle;
