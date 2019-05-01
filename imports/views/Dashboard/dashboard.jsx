import React from "react";
import PropTypes from "prop-types";
import { Editor } from 'react-draft-wysiwyg';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import dashboardStyle from "./dashboardStyle.jsx";
import QuizTileContainer from "./quizTile";
import { withTracker } from "meteor/react-meteor-data";
import { Quizzes } from "../../collections";
import { connect } from "react-redux";
import { clearEditingQuiz } from "../../actions";

class Dashboard extends React.PureComponent {
  render() {
    const {
      classes,
      quizzes,
      onNewQuizEdit
    } = this.props;

    return (
      <div>
        <GridContainer>
          {quizzes.map(({ _id: quizId }) => {
            return (<GridItem key={quizId} xs={12} sm={6} md={3}>
              <QuizTileContainer quizId={quizId} />
            </GridItem>);
          })}
        </GridContainer>
        {/*todo replace url with something like "/quizzes/new". Use /quizzes/:id/edit for edit exists */}
        <Fab color="primary" className={classes.addCardFab} onClick={onNewQuizEdit}>
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    onNewQuizEdit() {
      dispatch(clearEditingQuiz());

      history.push("/admin/edit-quiz")
    },
  }
};

const DashboardContainer = withTracker(() => {
  return {
    quizzes: Quizzes.find().fetch()
  };
})(withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));


export default DashboardContainer;
