"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const router = new router_1.Router(document.querySelector('.root'));
router.setRoutes([
    { path: '/', component: 'home-page' },
    { path: '/inicio', component: 'inicio-page' },
    { path: '/instruction', component: 'instructions-page' },
    { path: '/codigo', component: 'codigo-page' },
    { path: '/comenzar', component: 'comenzar-button' },
    { path: '/playGame', component: 'play-game' },
    { path: '/Results', component: 'results-page' }
]);
