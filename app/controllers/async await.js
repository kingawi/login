exports.signup = async (req, res) => {
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
	})
	try {
		await user.save((user) => {
			if (req.body.roles) {
				//console.log(req.body.roles, 'w ifie')
				Role.find(
					{
						name: { $in: req.body.roles }, //ten zapis iteruje po tablicy z rolami
					},
					(err, roles) => {
						if (err) {
							res.status(500).send({ message: err })
							return
						}
						//przyporzadkowuje role do tworzonego uzytkownika
						user.roles = roles.map(role => role._id)
						user.save(err => {
							if (err) {
								res.status(500).send({ message: err })
								return
							}

							res.send({ message: 'User was registered successfully!' })
						})
					}
				)
			} else {
				//console.log(req.body.roles, 'w elsie')
				Role.findOne({ name: 'user' }, (err, role) => {
					if (err) {
						res.status(500).send({ message: err })
						return
					}
					user.roles = [role._id]
					user.save(err => {
						if (err) {
							res.status(500).send({ message: err })
							return
						}

						res.send({ message: 'User was registered successfully!' })
					})
				})
			}
		})
	} catch (err) {
		res.status(500).send({ message: err })
		return
	}
}


getExercise = async (req, res) => {
		const trainerExercises = await Exercise.find({ exerciseCreator: req.body._id }
			).select({
				exerciseName: 1,
				exerciseDescription: 1,
				exerciseAddingDate: 1,
				exerciseCreator: 1,
				_id: 1,
			})
			res.send(trainerExercises)
	}

