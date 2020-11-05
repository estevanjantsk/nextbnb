import { User } from "../../../model";

export default async (req, res) => {
	if (req.method !== 'POST') {
		res.status(405).end() // method not allowed
		return
	}

	const { email, password, passwordconfirmation } = req.body;

	if (password !== passwordconfirmation) {
		res.status(500).json({ status: 'error', message: 'passwords do not match' })
		return
	}

	try {
		const user = await User.create({ email, password })

		req.login(user, err => {
			if (err) {
				res.status(500).json({ status: 'error', message: err })
				return
			}
			res.json({ status: 'success', message: 'user added' })
		})
	} catch (error) {
		let message = 'An error occurred'
		if (error.name === 'SequelizeUniqueConstraintError') {
			message = 'User already exists'
		}
		res.status(500).json({ status: 'error', message })
	}
}