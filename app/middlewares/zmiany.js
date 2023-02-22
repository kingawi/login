isTrainer = (req, res, next) => {
	User.findById(req.userId).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err })
			return
		}
		Role.find(
			{
				_id: { $in: user.roles },
			},
			(err, roles) => {
				if (err) {
					res.status(500).send({ message: err })
					return
				}

				for (let i = 0; i < roles.length; i++) {
					if (roles[i].name === 'trainer') {
						next()
						return
					}
				}

				res.status(403).send({ message: 'Require Trainer Role!' })
				return
			}
		)
	})
}
isTrainer = (req, res, next) => {
	try {
		User.findById(req.userId) //req.userId zwraca samo id wiec potrzebujemy zwrocic caly obiekt User ktory wysyla żądanie
		const role = Role.findOne({
			_id: { $in: user.roles },
         } )
        if (role.name === 'trainer') {
            next()
            return
        } else {
            res.status(403).send({ message: 'Require Trainer Role!' })
            return
        }
    }
	 catch (err) {
		res.status(500).send({ message: err })
		return
	}
}
