import './setup.js';
import app from './app.js'

const PORT = process.env.PORT || 4000

app.listen(PORT,() => console.log('Listening back on port ' + PORT));
