export default async (req, res) => {
	if (req.method !== 'POST') {
		res.status(405).end() // method not allowed
		return
	}

  req.logout()
  req.session.destroy()
  res.json({ status: 'success', message: 'logged out' })
}