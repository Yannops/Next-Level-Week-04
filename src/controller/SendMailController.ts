import { request, Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';
import { AppError } from '../errors/AppError';

class SendMailController {
    async execute(request: Request, response: Response) {
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const { email, survey_id } = request.body;

        const userRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const userExists = await userRepository.findOne({ email });

        if (!userExists) {
            return response.status(400).json({
                error: "Usuário não encontrado!"
            });
        }

        const surveyExists = await surveyRepository.findOne({ id: survey_id })

        if (!surveyExists) {
            throw new AppError("Enquete não encontrada!");
        }

        const enqueteRespondida = await surveyUserRepository.findOne({
            where: 
                {
                    user_id: userExists.id,
                    value: null
                },
            relations: ["user", "survey"]
        });

        const surveyUser = surveyUserRepository.create({
            user_id: userExists.id,
            survey_id
        });

        const variables = {
            name: userExists.name,
            title: surveyExists.title,
            description: surveyExists.description,
            id: "",
            link: process.env.urlmail
        }

        if (enqueteRespondida) {
            variables.id = enqueteRespondida.id;
            await SendMailService.execute(email, surveyExists.title, variables, npsPath);
            return response.json(enqueteRespondida);
        }

        await surveyUserRepository.save(surveyUser);
        variables.id = surveyUser.id;
        await SendMailService.execute(email, surveyExists.title, variables, npsPath);
        return response.json(surveyUser);
    }
}


export { SendMailController };