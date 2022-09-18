import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/serviceStep';

const route = Router();

route.post('/service-step', create);
// list
route.get('/service-step', list);
// remove
route.delete('/service-step/:id', remove);
// update
route.put('/service-step/:id', update);
// chi tiet
route.get('/service-step/:id', read);

export default route;
