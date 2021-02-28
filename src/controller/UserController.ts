import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;
        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"),
            email: yup.string().email().required("E-mail é obrigatório")
        });

        /*if (!(await schema.isValid(request.body))) {
            return response.status(400).json({
                error: "Erro de validação!"
            });
        }*/

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (erro) {
            throw new AppError(erro);
            
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userInDatabase = await usersRepository.findOne({
            name,
            email
        })

        if (userInDatabase) {
            throw new AppError("Usuário já cadastrado");
        }

        const user = usersRepository.create({
            name,
            email
        })
        await usersRepository.save(user);
        return response.status(201).json(user);
    }

    async show(request: Request, response: Response) {
        const userRepository = getCustomRepository(UsersRepository);

        const all = await userRepository.find();

        return response.json(all);
    }
}

export { UserController };

