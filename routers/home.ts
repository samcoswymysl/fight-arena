import {Router} from "express";

export const homeRouter= Router()

homeRouter
    .get('/', (req, res, next) => {
    res.render('home/home.hbs')
})
