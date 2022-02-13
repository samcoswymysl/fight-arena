import {Router} from "express";

export const hallOfGloryRouter= Router()

hallOfGloryRouter
    .get('/', (req, res, next) => {
        res.render('hall-of-glory/hall-of-glory.hbs')
    })
