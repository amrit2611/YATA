// creating todos
app.post('/todo', logger, auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    });

    res.json({ message: 'Todo created!!' })
})


//fetch todos
app.get('/todos', logger, auth, async (req, res) => {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId: userId
    })

    res.json({ todos })
})
