import { Router } from 'express';
import { create, list, read, remove, update } from '../controllers/bill';

const route = Router();

route.post('/bill', create);
// list
route.get('/bill', list);
// remove
route.delete('/bill/:id', remove);
// update
route.put('/bill/:id', update);
// chi tiet
route.get('/bill/:id', read);

export default route;
