import app  from './app.js'
import bcrypt from 'bcrypt';

// Server listen
app.listen(process.env.PORT, () =>
  console.log(
    `Server listening at port ${process.env.PORT}`,
  ),
);
