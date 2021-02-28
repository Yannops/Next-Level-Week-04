import { Router } from 'express';
import { AnswerController } from './controller/AnswerController';
import { SendMailController } from './controller/SendMailController';
import { SurveysController } from './controller/SurveysController';
import { UserController } from './controller/UserController';
import { NPSController } from './controller/npsController';

const router = Router();
const userController = new UserController;
const surveyController = new SurveysController;
const sendMailController = new SendMailController;
const answerController = new AnswerController;
const npsController = new NPSController;

router.get("/surveys", surveyController.show);
router.post("/surveys", surveyController.create);

router.get("/users", userController.show);
router.post("/users", userController.create);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps", npsController.execute);

export { router };