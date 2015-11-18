import { Router } from 'express'

import { dribbbleService } from '../services'

const router = Router()

router.get('/', (req, res) => {
  dribbbleService.getRandom()
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(400).send({ message: err.message })
    })
})

export default router