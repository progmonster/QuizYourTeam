import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Quizzes, Teams } from '../../model/collections';
import { QuizRoles } from '../../model/roles';
import Quiz from '../../model/quiz';
import QuizCreator from '../../model/quizCreator';
import QuizPassResult from '../../model/quizPassResult';

const MAX_POSSIBLE_RESULT = 10;

const quizService = {
  insert(quiz, creator) {
    check(quiz._id, undefined);
    check(quiz.teamId, String);
    check(creator, Object);
    check(Teams.isUserInTeam(quiz.teamId, creator._id), true);

    const createdAt = new Date();

    const sanitizedQuiz = new Quiz({
      title: quiz.title,
      descriptionEditorState: quiz.descriptionEditorState,
      paragraphs: quiz.paragraphs || [],
      questions: quiz.questions || [], // todo validate question with answers
      creator: new QuizCreator(creator),
      createdAt,
      updatedAt: createdAt,
      teamId: quiz.teamId,
      maxPossibleResult: MAX_POSSIBLE_RESULT,
      passed: [],
    });

    const quizId = Quizzes.insert(sanitizedQuiz);

    const team = Teams.findOne(quiz.teamId);

    Roles.addQuizRolesForUsers(
      team.participants,
      [QuizRoles.viewQuiz, QuizRoles.passQuiz],
      quizId,
    );

    Roles.addQuizRolesForUsers(
      [...team.getAdmins(), creator._id],
      [QuizRoles.editQuiz, QuizRoles.removeQuiz],
      quizId,
    );

    return quizId;
  },

  update(quiz, actorId) {
    check(quiz._id, String);
    check(actorId, String);
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.editQuiz, quiz._id), true);

    // todo progmonster copy only known quiz fields from a client
    Quizzes.update(quiz._id, {
      $set: {
        title: quiz.title,
        updatedAt: new Date(),
        descriptionEditorState: quiz.descriptionEditorState,
        paragraphs: quiz.paragraphs,
        questions: quiz.questions,
      },
    });
  },

  remove(quizId, actorId) {
    check(quizId, String);
    check(actorId, String);
    check(Roles.hasUserQuizRoles(actorId, QuizRoles.removeQuiz, quizId), true);

    Quizzes.remove(quizId);

    Roles.removeQuizRolesForAllUsers(quizId);
  },

  checkAndSetUserAnswers(quizId, user, quizUpdatedAt, answers) {
    // todo progmonster check quiz quizUpdatedAt
    // todo progmonster check args
    // todo progmonster check permissions

    console.log(JSON.stringify(answers, null, 2));

    // todo progmonster
    const quizPassResult = QuizPassResult.createForUser(
      user,
      9.1,
      MAX_POSSIBLE_RESULT,
      10,
      9,
      new Date(),
    );

    Quizzes.update(quizId, {
      $pull: {
        passed: { 'user._id': user._id },
      },
    });

    Quizzes.update(quizId, {
      $push: {
        passed: quizPassResult,
      },
    });

    return quizPassResult;
  },
};

export default quizService;
